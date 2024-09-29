using System.Reflection;
using FluentValidation;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using TrailMates.Application.Common;

namespace TrailMates.Application;

public static class Extensions
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(typeof(Extensions).Assembly);
        });
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
        return services;
    }

    public static WebApplication UseApplication(this WebApplication app)
    {
        app.RegisterEndpoints(Assembly.GetExecutingAssembly());
        return app;
    }
}
