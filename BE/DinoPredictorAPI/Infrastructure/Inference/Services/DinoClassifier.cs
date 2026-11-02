using System.Runtime.InteropServices;
using System.Security.Cryptography;
using System.Text.Json;
using DinoPredictorAPI.Interfaces;
using Microsoft.Extensions.Options;
using Microsoft.ML.OnnxRuntime;
using Microsoft.ML.OnnxRuntime.Tensors;

namespace DinoPredictorAPI.Infrastructure;

public sealed class DinoClassifier : IDinoClassifier, IDisposable
{
    private const int TopCandidates = 5;
    private const int ModelVersionLength = 12;
    private const string ModelFile = "model.onnx";
    private const string InfoFile = "model-info.json";
    private const string LabelsFile = "labels.json";

    private static readonly JsonSerializerOptions JsonOptions = new() { PropertyNameCaseInsensitive = true };

    private readonly InferenceSession _session;
    private readonly ModelInfo _info;
    private readonly string[] _labels;
    private readonly float[] _camWeights;
    private readonly int _channels;

    public DinoClassifier(IOptions<ModelOptions> options)
    {
        var directory = Path.Combine(AppContext.BaseDirectory, options.Value.Directory);

        _info = ReadJson<ModelInfo>(directory, InfoFile);
        _labels = ReadJson<string[]>(directory, LabelsFile);

        var modelPath = Path.Combine(directory, ModelFile);
        var weightsPath = Path.Combine(directory, _info.CamWeights.File);
        VerifyChecksum(modelPath, _info.Sha256);
        VerifyChecksum(weightsPath, _info.CamWeights.Sha256);

        if (_info.Input.Shape[^1] != ImagePreprocessor.InputSize)
        {
            throw new InvalidOperationException(
                $"The model expects {_info.Input.Shape[^1]}px input, the preprocessor produces {ImagePreprocessor.InputSize}px."
            );
        }

        _channels = _info.CamWeights.Shape[1];
        _camWeights = MemoryMarshal.Cast<byte, float>(File.ReadAllBytes(weightsPath)).ToArray();
        if (_camWeights.Length != _labels.Length * _channels)
        {
            throw new InvalidOperationException($"{_info.CamWeights.File} does not match {LabelsFile}.");
        }

        using var sessionOptions = new Microsoft.ML.OnnxRuntime.SessionOptions { IntraOpNumThreads = 1 };
        _session = new InferenceSession(modelPath, sessionOptions);

        ModelVersion = _info.Sha256[..ModelVersionLength];
    }

    public string ModelVersion { get; }

    public IReadOnlyList<string> Labels => _labels;

    public ClassificationResult Classify(DenseTensor<float> tensor)
    {
        var (probabilitiesName, featuresName) = (_info.Outputs.Probabilities.Name, _info.Outputs.Features.Name);

        using var outputs = _session.Run(
            [NamedOnnxValue.CreateFromTensor(_info.Input.Name, tensor)],
            [probabilitiesName, featuresName]
        );

        var probabilities = outputs.First(o => o.Name == probabilitiesName).AsEnumerable<float>().ToArray();
        var features = outputs.First(o => o.Name == featuresName).AsTensor<float>().ToDenseTensor();

        var ranked = Enumerable.Range(0, probabilities.Length).OrderByDescending(i => probabilities[i]).ToArray();

        var candidates = ranked
            .Take(TopCandidates)
            .Select(i => new ClassPrediction(_labels[i], probabilities[i]))
            .ToArray();

        return new ClassificationResult(candidates, BuildCam(features, ranked[0]));
    }

    public void Dispose() => _session.Dispose();

    private float[,] BuildCam(DenseTensor<float> features, int predictedClass)
    {
        var (height, width) = (features.Dimensions[2], features.Dimensions[3]);
        var weights = _camWeights.AsSpan(predictedClass * _channels, _channels);
        var values = features.Buffer.Span;

        var cam = new float[height, width];
        var max = 0f;
        for (var y = 0; y < height; y++)
        {
            for (var x = 0; x < width; x++)
            {
                var sum = 0f;
                for (var channel = 0; channel < _channels; channel++)
                {
                    sum += weights[channel] * values[((channel * height) + y) * width + x];
                }

                cam[y, x] = Math.Max(sum, 0f);
                max = Math.Max(max, cam[y, x]);
            }
        }

        if (max > 0f)
        {
            for (var y = 0; y < height; y++)
            {
                for (var x = 0; x < width; x++)
                {
                    cam[y, x] /= max;
                }
            }
        }

        return cam;
    }

    private static T ReadJson<T>(string directory, string file) =>
        JsonSerializer.Deserialize<T>(File.ReadAllText(Path.Combine(directory, file)), JsonOptions)
        ?? throw new InvalidOperationException($"{file} is empty.");

    private static void VerifyChecksum(string path, string expected)
    {
        var actual = Convert.ToHexString(SHA256.HashData(File.ReadAllBytes(path)));
        if (!actual.Equals(expected, StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException($"{Path.GetFileName(path)} does not match its checksum in {InfoFile}.");
        }
    }
}
