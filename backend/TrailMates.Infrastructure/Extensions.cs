using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using TrailMates.Application.Common.Interfaces;
using TrailMates.Infrastructure.Common.Configuration;
using TrailMates.Infrastructure.Common.Persistence;
using TrailMates.Infrastructure.Trails.Persistence;
using TrailMates.Infrastructure.Users.Persistence;

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

        services.AddPostgres(configuration);

        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(options =>
        {
            options.AddSecurityDefinition(
                "oauth2",
                new OpenApiSecurityScheme
                {
                    In = ParameterLocation.Header,
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey
                }
            );
        });

        return services;
    }

    private static void AddPostgres(this IServiceCollection services, IConfiguration configuration)
    {
        var dbSettings = new DatabaseSettings();
        configuration.Bind(DatabaseSettings.DatabaseSettingsKey, dbSettings);

        services.AddScoped<ITrailRepository, InMemoryTrailsRepository>();
        services.AddScoped<IUserRepository, UserRepository>();

        services.AddDbContext<UsersDbContext>(options =>
            options.UseNpgsql(dbSettings.ConnectionString)
        );
    }

    public static WebApplication UseInfrastructure(this WebApplication app)
    {
        app.UseSwagger();
        app.UseSwaggerUI(options =>
        {
            options.SwaggerEndpoint("/swagger/v1/swagger.json", "TrailMates API V1");
            options.RoutePrefix = string.Empty;
        });

        return app;
    }
}
