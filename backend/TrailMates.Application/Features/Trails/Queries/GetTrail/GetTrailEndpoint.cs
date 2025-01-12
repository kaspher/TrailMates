using CSharpFunctionalExtensions;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using TrailMates.Application.Abstractions;
using TrailMates.Application.Common;
using TrailMates.Domain.Errors;
using IResult = Microsoft.AspNetCore.Http.IResult;

namespace TrailMates.Application.Features.Trails.Queries.GetTrail;

internal sealed class GetTrailEndpoint : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder endpoints) =>
        endpoints
            .MapGroup("/api/trails")
            .MapGet("/{trailId}", HandleGet)
            .WithName("get-trail")
            .WithTags(Constants.TrailsTag);

    private static Task<IResult> HandleGet(
        Guid trailId,
        IMediator dispatcher,
        CancellationToken cancellationToken
    ) =>
        dispatcher
            .Send(new GetTrailQuery(trailId), cancellationToken)
            .Match(Results.Ok, error => error.ToErrorProblemResult());
}
