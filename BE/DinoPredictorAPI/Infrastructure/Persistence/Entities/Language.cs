using System.Collections.Generic;

namespace DinoPredictorAPI.Infrastructure;

public partial class Language
{
    public byte Id { get; set; }

    public string Code { get; set; } = null!;

    public string Name { get; set; } = null!;

    public virtual ICollection<DinoTypeTranslation> DinoTypeTranslations { get; set; } = new List<DinoTypeTranslation>();
}
