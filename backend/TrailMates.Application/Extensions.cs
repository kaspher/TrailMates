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
            RegisterUsersBehavior(cfg);
            RegisterTrailsBehavior(cfg);
        });
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
        return services;
    }

    private static void RegisterUsersBehavior(MediatRServiceConfiguration cfg)
    {
        // soon
    }

    private static void RegisterTrailsBehavior(MediatRServiceConfiguration cfg)
    {
        // e.g. cfg.AddBehavior<GetAllTrailsQuery, Result<ImmutableList<TrailDto>, Error>>();
    }

    public static WebApplication UseApplication(this WebApplication app)
    {
        app.RegisterEndpoints(Assembly.GetExecutingAssembly());
        return app;
    }
}
