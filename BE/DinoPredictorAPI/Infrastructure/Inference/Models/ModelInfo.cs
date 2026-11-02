namespace DinoPredictorAPI.Infrastructure;

/// <summary>The part of model-info.json (written by tools/export_onnx.py) that the API relies on.</summary>
internal sealed record ModelInfo(
    string Sha256,
    ModelInput Input,
    ModelOutputs Outputs,
    CamWeightsInfo CamWeights);

internal sealed record ModelInput(string Name, int[] Shape);

internal sealed record ModelOutputs(ModelOutput Probabilities, ModelOutput Features);

internal sealed record ModelOutput(string Name, int[] Shape);

internal sealed record CamWeightsInfo(string File, string Sha256, int[] Shape);
