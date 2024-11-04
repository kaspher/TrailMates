using CSharpFunctionalExtensions;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using TrailMates.Application.Abstractions;
using TrailMates.Application.Common;
using TrailMates.Application.Features.Users.Commands.Contracts;
using TrailMates.Domain.Errors;
using IResult = Microsoft.AspNetCore.Http.IResult;

namespace TrailMates.Application.Features.Users.Commands.UpdateProfilePicture;

internal sealed class UpdateProfilePictureEndpoint : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder endpoints) =>
        endpoints
            .MapGroup("/api/users")
            .MapPost("/{userId}/update-profile-picture", HandlePost)
            .WithName("update-profile-picture")
            .WithTags(Constants.UsersTag)
            .DisableAntiforgery();

    private static Task<IResult> HandlePost(
        [AsParameters] UpdateProfilePictureRequest request,
        IMediator dispatcher,
        IValidator<UpdateProfilePictureRequest> validator,
        CancellationToken cancellationToken
    ) =>
        validator
            .Validate(request)
            .ToInputValidationResult()
            .Bind(() => dispatcher.Send(request.ToCommand(), cancellationToken))
            .Match(Results.NoContent, error => error.ToErrorProblemResult());
}
