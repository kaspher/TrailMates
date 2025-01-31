using CSharpFunctionalExtensions;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using TrailMates.Application.Abstractions;
using TrailMates.Application.Common;
using TrailMates.Application.Features.Events.Commands.Contracts;
using TrailMates.Domain.Errors;
using IResult = Microsoft.AspNetCore.Http.IResult;

namespace TrailMates.Application.Features.Events.Commands.JoinEvent;

internal sealed class JoinEventEndpoint : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder endpoints) =>
        endpoints
            .MapGroup("/api/events/{eventId}")
            .MapPost("/join", HandlePost)
            .WithName("join-event")
            .WithTags(Constants.EventsTag);

    private static Task<IResult> HandlePost(
        [AsParameters] EventRequest request,
        IMediator dispatcher,
        IValidator<EventRequest> validator,
        CancellationToken cancellationToken
    ) =>
        validator
            .Validate(request)
            .ToInputValidationResult()
            .Bind(() => dispatcher.Send(request.ToJoinCommand(), cancellationToken))
            .Match(Results.NoContent, error => error.ToErrorProblemResult());
}
