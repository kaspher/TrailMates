namespace TrailMates.Infrastructure.Common.Configuration;

public class AwsSettings
{
    public const string AwsSettingsKey = "AWSCustom";
    public string BucketName { get; set; } = string.Empty;
    public string CloudfrontUrl { get; set; } = string.Empty;
}
