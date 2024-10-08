﻿using System.Reflection;
using Microsoft.AspNetCore.Routing;
using TrailMates.Application.Abstractions;

namespace TrailMates.Application.Common;

public static class EndpointDiscovery
{
    private static readonly Type EndpointType = typeof(IEndpoint);

    public static void RegisterEndpoints(
        this IEndpointRouteBuilder endpoints,
        params Assembly[] assemblies
    )
    {
        if (assemblies.Length == 0)
        {
            throw new ArgumentException(
                "At least one assembly must be provided.",
                nameof(assemblies)
            );
        }

        var endpointTypes = GetEndpointTypes(assemblies);

        foreach (var type in endpointTypes)
        {
            var method = GetMapEndpointMethod(type);
            method?.Invoke(null, [endpoints]);
        }
    }

    private static IEnumerable<Type> GetEndpointTypes(params Assembly[] assemblies) =>
        assemblies
            .SelectMany(x => x.GetTypes())
            .Where(x =>
                EndpointType.IsAssignableFrom(x) && x is { IsInterface: false, IsAbstract: false }
            );

    private static MethodInfo? GetMapEndpointMethod(Type type) =>
        type.GetMethod(nameof(IEndpoint.MapEndpoint), BindingFlags.Static | BindingFlags.Public);
}
