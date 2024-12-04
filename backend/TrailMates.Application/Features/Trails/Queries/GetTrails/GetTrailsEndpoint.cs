﻿using CSharpFunctionalExtensions;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using TrailMates.Application.Abstractions;
using TrailMates.Application.Common;
using TrailMates.Domain.Errors;
using IResult = Microsoft.AspNetCore.Http.IResult;

namespace TrailMates.Application.Features.Trails.Queries.GetTrails;

internal sealed class GetTrailsEndpoint : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder endpoints) =>
        endpoints
            .MapGroup("/api/trails")
            .MapGet("", HandleGet)
            .WithName("get_trails")
            .WithTags(Constants.TrailsTag);

    private static Task<IResult> HandleGet(
        IMediator dispatcher,
        CancellationToken cancellationToken
    ) =>
        dispatcher
            .Send(new GetTrailsQuery(), cancellationToken)
            .Match(Results.Ok, error => error.ToErrorProblemResult());
}