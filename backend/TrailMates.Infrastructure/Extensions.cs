using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using TrailMates.Core.Repositories;
using TrailMates.Infrastructure.DAL.Repositories;

namespace TrailMates.Infrastructure;

public static class Extensions
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        services.AddControllers();
        services.Configure<AppOptions>(configuration.GetRequiredSection("app"));
        services.AddHttpContextAccessor();

        services.AddSingleton<ITrailRepository, InMemoryTrailsRepository>();

        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(swagger =>
        {
            swagger.EnableAnnotations();
            swagger.SwaggerDoc("v1", new OpenApiInfo { Title = "TrailMates API", Version = "v1" });
        });

        return services;
    }

    public static WebApplication UseInfrastructure(this WebApplication app)
    {
        app.UseSwagger();
        app.UseSwaggerUI(options =>
        {
            options.SwaggerEndpoint("/swagger/v1/swagger.json", "TrailMates API V1");
            options.RoutePrefix = string.Empty;
        });
        app.UseReDoc(reDoc =>
        {
            reDoc.RoutePrefix = "docs";
            reDoc.SpecUrl("/swagger/v1/swagger.json");
            reDoc.DocumentTitle = "TrailMates API";
        });

        return app;
    }
}
