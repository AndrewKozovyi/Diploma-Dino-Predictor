using DinoPredictorAPI.Interfaces;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;

namespace DinoPredictorAPI.Infrastructure;

public sealed class CamRenderer : ICamRenderer
{
    private const float HeatOpacity = 0.45f;
    private const int OutputScale = 2;

    private static readonly JpegEncoder Encoder = new() { Quality = 90 };

    public MemoryStream Render(Image<Rgb24> modelView, float[,] cam)
    {
        using var overlay = modelView.Clone();
        var (width, height) = (overlay.Width, overlay.Height);

        overlay.ProcessPixelRows(pixels =>
        {
            for (var y = 0; y < height; y++)
            {
                var row = pixels.GetRowSpan(y);
                for (var x = 0; x < width; x++)
                {
                    row[x] = Blend(row[x], Jet(SampleBilinear(cam, x, y, width, height)));
                }
            }
        });

        overlay.Mutate(x => x.Resize(width * OutputScale, height * OutputScale, KnownResamplers.Bicubic));

        var stream = new MemoryStream();
        overlay.SaveAsJpeg(stream, Encoder);
        stream.Position = 0;
        return stream;
    }

    private static float SampleBilinear(float[,] cam, int x, int y, int width, int height)
    {
        var (camHeight, camWidth) = (cam.GetLength(0), cam.GetLength(1));

        var sourceX = Math.Clamp(((x + 0.5f) * camWidth / width) - 0.5f, 0f, camWidth - 1f);
        var sourceY = Math.Clamp(((y + 0.5f) * camHeight / height) - 0.5f, 0f, camHeight - 1f);

        var (left, top) = ((int)sourceX, (int)sourceY);
        var (right, bottom) = (Math.Min(left + 1, camWidth - 1), Math.Min(top + 1, camHeight - 1));
        var (weightX, weightY) = (sourceX - left, sourceY - top);

        var upper = float.Lerp(cam[top, left], cam[top, right], weightX);
        var lower = float.Lerp(cam[bottom, left], cam[bottom, right], weightX);
        return float.Lerp(upper, lower, weightY);
    }

    private static (float R, float G, float B) Jet(float value) =>
        (
            Math.Clamp(1.5f - Math.Abs((4f * value) - 3f), 0f, 1f),
            Math.Clamp(1.5f - Math.Abs((4f * value) - 2f), 0f, 1f),
            Math.Clamp(1.5f - Math.Abs((4f * value) - 1f), 0f, 1f)
        );

    private static Rgb24 Blend(Rgb24 pixel, (float R, float G, float B) heat) =>
        new(Mix(pixel.R, heat.R), Mix(pixel.G, heat.G), Mix(pixel.B, heat.B));

    private static byte Mix(byte channel, float heat) =>
        (byte)Math.Round((channel * (1f - HeatOpacity)) + (heat * 255f * HeatOpacity));
}
