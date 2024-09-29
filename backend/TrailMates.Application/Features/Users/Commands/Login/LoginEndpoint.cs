using CSharpFunctionalExtensions;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using TrailMates.Application.Abstractions;
using TrailMates.Application.Features.Users.Commands.Contracts;
using TrailMates.Domain.Errors;
using IResult = Microsoft.AspNetCore.Http.IResult;

namespace TrailMates.Application.Features.Users.Commands.Login;

internal sealed class LoginEndpoint : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder endpoints) =>
        endpoints
            .MapGroup("/api/account")
            .MapPost("/login", HandlePost)
            .WithName("login")
            .WithTags("Users");

    private static Task<IResult> HandlePost(
        [FromBody] LoginRequest request,
        IMediator dispatcher,
        CancellationToken cancellationToken
    ) =>
        dispatcher
            .Send(new LoginCommand(request.Email, request.Password), cancellationToken)
            .Match(Results.Ok, error => error.ToErrorProblemResult());
}
