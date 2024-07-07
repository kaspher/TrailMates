using System.Collections.Immutable;
using System.Reflection;
using CSharpFunctionalExtensions;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using TrailMates.Application.Common;
using TrailMates.Application.DTO;
using TrailMates.Application.Features.Trails.Queries.GetTrails;
using TrailMates.Core.Errors;

namespace TrailMates.Application;

public static class Extensions
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
        services.AddMediatR(cfg =>
        {
            cfg.RegisterServicesFromAssembly(typeof(Extensions).Assembly);
            cfg.AddBehavior<
                IPipelineBehavior<GetAllTrailsQuery, Result<ImmutableList<TrailDto>, Error>>,
                GetAllTrailsValidator
            >();
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
