using CSharpFunctionalExtensions;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using TrailMates.Application.Abstractions;
using TrailMates.Application.Common;
using TrailMates.Domain.Errors;
using IResult = Microsoft.AspNetCore.Http.IResult;

namespace TrailMates.Application.Features.Trails.Commands.UpdateTrailVisibility;

internal sealed class UpdateTrailVisibilityEndpoint : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder endpoints) =>
        endpoints
            .MapGroup("/api/trails")
            .MapPut("/{trailId}/visibility", HandlePut)
            .WithName("update-trail-visibility")
            .WithTags(Constants.TrailsTag);

    private static Task<IResult> HandlePut(
        [FromRoute] Guid trailId,
        IMediator dispatcher,
        CancellationToken cancellationToken
    ) =>
        dispatcher
            .Send(new UpdateTrailVisibilityCommand(trailId), cancellationToken)
            .Match(Results.NoContent, error => error.ToErrorProblemResult());
}
