using CSharpFunctionalExtensions;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using TrailMates.Application.Abstractions;
using TrailMates.Application.Common;
using TrailMates.Application.Features.Activities.Commands.Contracts;
using TrailMates.Domain.Errors;
using IResult = Microsoft.AspNetCore.Http.IResult;

namespace TrailMates.Application.Features.Activities.Commands.AddLike;

internal sealed class AddLikeEndpoint : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder endpoints) =>
        endpoints
            .MapGroup("/api/activities")
            .MapPost("{activityId}/likes", HandlePost)
            .WithName("add-activity-like")
            .WithTags(Constants.ActivitiesTag);

    private static Task<IResult> HandlePost(
        [AsParameters] AddLikeRequest request,
        IMediator dispatcher,
        IValidator<AddLikeRequest> validator,
        CancellationToken cancellationToken
    ) =>
        validator
            .Validate(request)
            .ToInputValidationResult()
            .Bind(() => dispatcher.Send(request.ToCommand(), cancellationToken))
            .Match(Results.NoContent, error => error.ToErrorProblemResult());
}
