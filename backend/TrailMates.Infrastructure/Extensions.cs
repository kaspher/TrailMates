using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Npgsql;
using TrailMates.Application.Abstractions;
using TrailMates.Application.Abstractions.Authentication;
using TrailMates.Application.Abstractions.Repositories;
using TrailMates.Infrastructure.Common.Authentication;
using TrailMates.Infrastructure.Common.Configuration;
using TrailMates.Infrastructure.Common.Persistence;
using TrailMates.Infrastructure.Persistence.Activities;
using TrailMates.Infrastructure.Persistence.Events;
using TrailMates.Infrastructure.Persistence.Trails;
using TrailMates.Infrastructure.Persistence.Users;
using TrailMates.Infrastructure.Services;

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
        services.AddAuthenticationInternal(configuration);
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

        services.AddScoped<ITrailRepository, TrailRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<IRoleRepository, RoleRepository>();
        services.AddScoped<IEventRepository, EventRepository>();
        services.AddScoped<IActivityRepository, ActivityRepository>();

        services.AddScoped<IUserService, UserService>();

        services.AddDbContext<UsersDbContext>(options =>
            options.UseNpgsql(dbSettings.ConnectionString)
        );

        var dataSource = new NpgsqlDataSourceBuilder(dbSettings.ConnectionString)
            .EnableDynamicJson()
            .Build();

        services.AddDbContext<CoreDbContext>(options =>
        {
            options.UseNpgsql(dataSource);
        });

        AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
    }

    private static void AddAuthenticationInternal(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        services.AddTransient<ITokenProvider, TokenProvider>();
        services.AddSingleton<IPasswordHasher, PasswordHasher>();

        services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(x =>
            {
                x.TokenValidationParameters = new TokenValidationParameters
                {
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(configuration["Jwt:Secret"]!)
                    ),
                    ValidIssuer = configuration["Jwt:Issuer"],
                    ValidAudience = configuration["Jwt:Audience"],
                    ClockSkew = TimeSpan.Zero
                };
            });
    }

    public static WebApplication UseInfrastructure(this WebApplication app)
    {
        return app;
    }
}
