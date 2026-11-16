using System.Linq.Expressions;

namespace DinoPredictorAPI.Application;

public static class DinoTypeMappings
{
    public static Expression<Func<DinoType, DinoTypeDto>> ToDto(string language) =>
        x => new DinoTypeDto
        {
            Code = x.Code,
            Name =
                x.DinoTypeTranslations.Where(t => t.Language.Code == language).Select(t => t.Name).FirstOrDefault()
                ?? x.Code,
        };
}
