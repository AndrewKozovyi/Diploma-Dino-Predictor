using System.Globalization;
using System.Text.RegularExpressions;
using DbUp;

namespace DinoPredictorAPI.Persistence;

/// <summary>
/// Applies the SQL scripts from /DB (embedded into the assembly) with DbUp.
/// Each script runs once; DbUp records executed scripts in dbo.SchemaVersions.
/// </summary>
internal static partial class DatabaseMigrator
{
    public static void Migrate(string connectionString, bool createIfMissing)
    {
        if (createIfMissing)
        {
            EnsureDatabase.For.SqlDatabase(connectionString);
        }

        var result = DeployChanges.To
            .SqlDatabase(connectionString)
            .WithScriptsEmbeddedInAssembly(typeof(DatabaseMigrator).Assembly, name => name.EndsWith(".sql", StringComparison.OrdinalIgnoreCase))
            .WithScriptNameComparer(new ScriptTimestampComparer())
            .LogToConsole()
            .Build()
            .PerformUpgrade();

        if (!result.Successful)
        {
            throw new InvalidOperationException($"Database migration failed on script '{result.ErrorScript?.Name}'.", result.Error);
        }
    }

    /// <summary>
    /// Orders scripts by the timestamp in their name (DDP_dd_MM_yyyy_HH_mm_Description.sql).
    /// </summary>
    private sealed class ScriptTimestampComparer : IComparer<string>
    {
        public int Compare(string? x, string? y) =>
            ParseTimestamp(x).CompareTo(ParseTimestamp(y)) is var byDate and not 0
                ? byDate
                : string.CompareOrdinal(x, y);

        private static DateTime ParseTimestamp(string? scriptName)
        {
            var match = ScriptNamePattern().Match(scriptName ?? string.Empty);
            if (!match.Success)
            {
                throw new InvalidOperationException(
                    $"Script '{scriptName}' does not follow the naming convention DDP_dd_MM_yyyy_HH_mm_Description.sql.");
            }

            return DateTime.ParseExact(match.Groups["timestamp"].Value, "dd_MM_yyyy_HH_mm", CultureInfo.InvariantCulture);
        }
    }

    [GeneratedRegex(@"DDP_(?<timestamp>\d{2}_\d{2}_\d{4}_\d{2}_\d{2})_")]
    private static partial Regex ScriptNamePattern();
}
