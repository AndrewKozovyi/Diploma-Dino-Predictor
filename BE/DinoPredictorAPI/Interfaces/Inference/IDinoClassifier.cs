using DinoPredictorAPI.Infrastructure;
using Microsoft.ML.OnnxRuntime.Tensors;

namespace DinoPredictorAPI.Interfaces;

public interface IDinoClassifier
{
    string ModelVersion { get; }

    IReadOnlyList<string> Labels { get; }

    ClassificationResult Classify(DenseTensor<float> tensor);
}
