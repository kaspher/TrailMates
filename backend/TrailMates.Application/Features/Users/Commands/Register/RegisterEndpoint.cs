using CSharpFunctionalExtensions;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using TrailMates.Application.Abstractions;
using TrailMates.Domain.Errors;
using IResult = Microsoft.AspNetCore.Http.IResult;

namespace TrailMates.Application.Features.Users.Commands.Register;

internal sealed class RegisterEndpoint : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder endpoints) =>
        endpoints
            .MapGroup("/api/account")
            .MapPost("/register", HandlePost)
            .WithName("register")
            .WithTags("Users");

    private static Task<IResult> HandlePost(
        [FromBody] RegisterCommand request,
        IMediator dispatcher,
        CancellationToken cancellationToken
    ) =>
        dispatcher
            .Send(
                new RegisterCommand(
                    request.Email,
                    request.FirstName,
                    request.LastName,
                    request.Gender,
                    request.Password
                ),
                cancellationToken
            )
            .Match(Results.Created, error => error.ToErrorProblemResult());
}
