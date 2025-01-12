using CSharpFunctionalExtensions;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using TrailMates.Application.Abstractions;
using TrailMates.Application.Common;
using TrailMates.Domain.Errors;
using IResult = Microsoft.AspNetCore.Http.IResult;

namespace TrailMates.Application.Features.Activities.Queries.GetActivity;

internal sealed class GetActivityEndpoint : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder endpoints) =>
        endpoints
            .MapGroup("/api/activities")
            .MapGet("/{activityId}", HandleGet)
            .WithName("get-activity")
            .WithTags(Constants.ActivitiesTag);

    private static Task<IResult> HandleGet(
        Guid activityId,
        IMediator dispatcher,
        CancellationToken cancellationToken
    ) =>
        dispatcher
            .Send(new GetActivityQuery(activityId), cancellationToken)
            .Match(Results.Ok, error => error.ToErrorProblemResult());
}
