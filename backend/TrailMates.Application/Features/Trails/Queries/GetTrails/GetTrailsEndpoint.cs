using CSharpFunctionalExtensions;
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
            .WithName("get-trails")
            .WithTags(Constants.TrailsTag);

    private static Task<IResult> HandleGet(
        [AsParameters] GetTrailsRequest request,
        IMediator dispatcher,
        CancellationToken cancellationToken
    ) =>
        dispatcher
            .Send(request.ToQuery(), cancellationToken)
            .Match(Results.Ok, error => error.ToErrorProblemResult());
}
