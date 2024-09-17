using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using TrailMates.Application.Abstractions;
using TrailMates.Application.Abstractions.Authentication;
using TrailMates.Infrastructure.Common.Authentication;
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
        services.AddAuthenticationInternal();
        services.AddAuthorization();

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

    private static void AddAuthenticationInternal(this IServiceCollection services)
    {
        services.AddTransient<ITokenProvider, TokenProvider>();
        services.AddSingleton<IPasswordHasher, PasswordHasher>();

        services
            .AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(x =>
            {
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(AuthenticationConfiguration.PrivateKey)
                    ),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });
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
