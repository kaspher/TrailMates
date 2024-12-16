using CSharpFunctionalExtensions;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using TrailMates.Application.Abstractions;
using TrailMates.Application.Common;
using TrailMates.Application.Features.Activities.Commands.Contracts;
using TrailMates.Domain.Errors;
using IResult = Microsoft.AspNetCore.Http.IResult;

namespace TrailMates.Application.Features.Activities.Commands.AddActivity;

internal sealed class AddActivityEndpoint : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder endpoints) =>
        endpoints
            .MapGroup("/api/activities")
            .MapPost("", HandlePost)
            .WithName("add-activity")
            .WithTags(Constants.ActivitiesTag);

    private static Task<IResult> HandlePost(
        [FromBody] AddActivityRequest request,
        IMediator dispatcher,
        IValidator<AddActivityRequest> validator,
        CancellationToken cancellationToken
    ) =>
        validator
            .Validate(request)
            .ToInputValidationResult()
            .Bind(() => dispatcher.Send(request.ToCommand(), cancellationToken))
            .Match(Results.NoContent, error => error.ToErrorProblemResult());
}
