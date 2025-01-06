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

namespace TrailMates.Application.Features.Activities.Commands.AddComment;

internal sealed class AddCommentEndpoint : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder endpoints) =>
        endpoints
            .MapGroup("/api/activities")
            .MapPost("{activityId}/comments", HandlePost)
            .WithName("add-activity-comment")
            .WithTags(Constants.ActivitiesTag);

    private static Task<IResult> HandlePost(
        [AsParameters] AddCommentRequest request,
        IMediator dispatcher,
        IValidator<AddCommentRequest> validator,
        CancellationToken cancellationToken
    ) =>
        validator
            .Validate(request)
            .ToInputValidationResult()
            .Bind(() => dispatcher.Send(request.ToCommand(), cancellationToken))
            .Match(Results.NoContent, error => error.ToErrorProblemResult());
}
