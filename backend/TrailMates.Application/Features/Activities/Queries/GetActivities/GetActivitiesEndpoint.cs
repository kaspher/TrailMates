using CSharpFunctionalExtensions;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using TrailMates.Application.Abstractions;
using TrailMates.Application.Common;
using TrailMates.Domain.Errors;
using IResult = Microsoft.AspNetCore.Http.IResult;

namespace TrailMates.Application.Features.Activities.Queries.GetActivities;

internal sealed class GetActivitiesEndpoint : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder endpoints) =>
        endpoints
            .MapGroup("/api/activities")
            .MapGet("", HandleGet)
            .WithName("get-activities")
            .WithTags(Constants.ActivitiesTag);

    private static Task<IResult> HandleGet(
        [AsParameters] GetActivitiesRequest request,
        IMediator dispatcher,
        CancellationToken cancellationToken
    ) =>
        dispatcher
            .Send(request.ToQuery(), cancellationToken)
            .Match(Results.Ok, error => error.ToErrorProblemResult());
}
