using DinoPredictorAPI.Interfaces;
using Microsoft.ML.OnnxRuntime.Tensors;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;

namespace DinoPredictorAPI.Infrastructure;

public sealed class ImagePreprocessor : IImagePreprocessor
{
    public const int InputSize = 224;

    public PreparedImage Prepare(Stream image)
    {
        Validate(image);
        image.Position = 0;

        var original = Image.Load<Rgb24>(image);
        try
        {
            original.Mutate(x => x.AutoOrient());
            RemovePublicMetadata(original);

            var modelView = CropForModel(original);
            return new PreparedImage(original, modelView, ToTensor(modelView));
        }
        catch
        {
            original.Dispose();
            throw;
        }
    }

    private static void Validate(Stream image)
    {
        ImageInfo info;
        try
        {
            info = Image.Identify(image);
        }
        catch (Exception exception) when (exception is ImageFormatException or NotSupportedException)
        {
            throw new InvalidImageException("The file is not a supported image.", exception);
        }

        if (info.Metadata.DecodedImageFormat is not (JpegFormat or PngFormat or WebpFormat))
        {
            throw new InvalidImageException("Only JPEG, PNG and WebP images are supported.");
        }

        const int maxDimension = UploadLimits.MaxImageDimension;
        if (info.Width > maxDimension || info.Height > maxDimension)
        {
            throw new InvalidImageException($"The image must not be larger than {maxDimension}x{maxDimension} pixels.");
        }
    }

    private static void RemovePublicMetadata(Image image)
    {
        image.Metadata.ExifProfile = null;
        image.Metadata.XmpProfile = null;
        image.Metadata.IptcProfile = null;

        var frame = image.Frames.RootFrame.Metadata;
        frame.ExifProfile = null;
        frame.XmpProfile = null;
        frame.IptcProfile = null;
    }

    private static Image<Rgb24> CropForModel(Image<Rgb24> original)
    {
        var (width, height) = (original.Width, original.Height);
        var (resizedWidth, resizedHeight) = width <= height
            ? (InputSize, (int)((long)InputSize * height / width))
            : ((int)((long)InputSize * width / height), InputSize);

        var left = (int)Math.Round((resizedWidth - InputSize) / 2.0);
        var top = (int)Math.Round((resizedHeight - InputSize) / 2.0);

        return original.Clone(x => x
            .Resize(resizedWidth, resizedHeight, KnownResamplers.Triangle)
            .Crop(new Rectangle(left, top, InputSize, InputSize)));
    }

    private static DenseTensor<float> ToTensor(Image<Rgb24> modelView)
    {
        var tensor = new DenseTensor<float>([1, 3, InputSize, InputSize]);

        modelView.ProcessPixelRows(pixels =>
        {
            for (var y = 0; y < InputSize; y++)
            {
                var row = pixels.GetRowSpan(y);
                for (var x = 0; x < InputSize; x++)
                {
                    tensor[0, 0, y, x] = row[x].R / 255f;
                    tensor[0, 1, y, x] = row[x].G / 255f;
                    tensor[0, 2, y, x] = row[x].B / 255f;
                }
            }
        });

        return tensor;
    }
}
