namespace TrailMates.Infrastructure.Common.Configuration;

public class DatabaseSettings
{
    public const string DatabaseSettingsKey = "Postgres";
    public string ConnectionString { get; set; } = string.Empty;
}
