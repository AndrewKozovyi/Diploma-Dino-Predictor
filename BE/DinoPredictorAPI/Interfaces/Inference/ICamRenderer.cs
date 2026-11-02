using SixLabors.ImageSharp;
using SixLabors.ImageSharp.PixelFormats;

namespace DinoPredictorAPI.Interfaces;

public interface ICamRenderer
{
    MemoryStream Render(Image<Rgb24> modelView, float[,] cam);
}
