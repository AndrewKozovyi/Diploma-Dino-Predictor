using Microsoft.ML.OnnxRuntime.Tensors;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.PixelFormats;

namespace DinoPredictorAPI.Infrastructure;

public sealed class PreparedImage(Image<Rgb24> original, Image<Rgb24> modelView, DenseTensor<float> tensor) : IDisposable
{
    private static readonly JpegEncoder OriginalEncoder = new() { Quality = 90 };

    /// <summary>The exact square the model sees (resize + center crop); CAM is drawn on top of it.</summary>
    public Image<Rgb24> ModelView { get; } = modelView;

    public DenseTensor<float> Tensor { get; } = tensor;

    public MemoryStream ToCleanJpeg()
    {
        var stream = new MemoryStream();
        original.SaveAsJpeg(stream, OriginalEncoder);
        stream.Position = 0;
        return stream;
    }

    public void Dispose()
    {
        original.Dispose();
        ModelView.Dispose();
    }
}
