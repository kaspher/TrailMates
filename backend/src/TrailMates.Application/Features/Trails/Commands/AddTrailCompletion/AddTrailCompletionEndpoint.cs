using CSharpFunctionalExtensions;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using TrailMates.Application.Abstractions;
using TrailMates.Application.Common;
using TrailMates.Application.Features.Trails.Commands.Contracts;
using TrailMates.Domain.Errors;
using IResult = Microsoft.AspNetCore.Http.IResult;

namespace TrailMates.Application.Features.Trails.Commands.AddTrailCompletion;

internal sealed class AddTrailEndpoint : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder endpoints) =>
        endpoints
            .MapGroup("/api/trails")
            .MapPost("{trailId}", HandlePost)
            .WithName("add-trail-completion")
            .WithTags(Constants.TrailsTag);

    private static Task<IResult> HandlePost(
        [FromRoute] Guid trailId,
        [FromBody] AddTrailCompletionRequest request,
        IMediator dispatcher,
        IValidator<AddTrailCompletionRequest> validator,
        CancellationToken cancellationToken
    ) =>
        validator
            .Validate(request)
            .ToInputValidationResult()
            .Bind(
                () =>
                    dispatcher.Send(
                        new AddTrailCompletionCommand(trailId, request),
                        cancellationToken
                    )
            )
            .Match(Results.NoContent, error => error.ToErrorProblemResult());
}
