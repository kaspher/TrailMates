using Microsoft.Extensions.Options;
using TrailMates.Infrastructure.Common.Configuration;

namespace TrailMates.Api;

public static class Extensions
{
    public static IServiceCollection AddPresentation(this IServiceCollection services)
    {
        return services;
    }

    public static WebApplication UsePresentation(this WebApplication app)
    {
        app.MapGet("/api", (IOptions<AppOptions> options) => Results.Ok(options.Value.Name));
        return app;
    }
}
