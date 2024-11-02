using Amazon.Runtime;
using Amazon.S3;
using Microsoft.Extensions.Options;
using TrailMates.Infrastructure.Common.Configuration;

namespace TrailMates.Api;

public static class Extensions
{
    public static IServiceCollection AddPresentation(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        services.AddAws(configuration);
        return services;
    }

    public static WebApplication UsePresentation(this WebApplication app)
    {
        app.MapGet("/api", (IOptions<AppOptions> options) => Results.Ok(options.Value.Name));
        return app;
    }

    private static void AddAws(this IServiceCollection services, IConfiguration configuration)
    {
        var options = configuration.GetAWSOptions();
        options.Credentials = new BasicAWSCredentials(
            configuration["AWS:AccessKey"],
            configuration["AWS:SecretKey"]
        );
        services.AddDefaultAWSOptions(options);
        services.AddAWSService<IAmazonS3>();
    }
}
