using CSharpFunctionalExtensions;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using TrailMates.Application.Abstractions;
using TrailMates.Application.Common;
using TrailMates.Domain.Errors;
using IResult = Microsoft.AspNetCore.Http.IResult;

namespace TrailMates.Application.Features.Events.Queries.GetEvents;

internal sealed class GetEventsEndpoint : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder endpoints) =>
        endpoints
            .MapGroup("/api/events")
            .MapGet("", HandleGet)
            .WithName("get_events")
            .WithTags(Constants.EventsTag);

    private static Task<IResult> HandleGet(
        [AsParameters] GetEventsRequest request,
        IMediator dispatcher,
        CancellationToken cancellationToken
    ) =>
        dispatcher
            .Send(request.ToQuery(), cancellationToken)
            .Match(Results.Ok, error => error.ToErrorProblemResult());
}
