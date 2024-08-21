using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using TrailMates.Api.Authentication;
using TrailMates.Infrastructure;
using TrailMates.Infrastructure.Common.Authentication;

namespace TrailMates.Api;

public static class Extensions
{
    public static IServiceCollection AddPresentation(this IServiceCollection services)
    {
        services.AddAuth();
        return services;
    }

    public static WebApplication UsePresentation(this WebApplication app)
    {
        app.MapGet("/api", (IOptions<AppOptions> options) => Results.Ok(options.Value.Name));
        return app;
    }

    private static void AddAuth(this IServiceCollection services)
    {
        services.AddTransient<AuthService>();

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
        services.AddAuthorization();
    }
}
