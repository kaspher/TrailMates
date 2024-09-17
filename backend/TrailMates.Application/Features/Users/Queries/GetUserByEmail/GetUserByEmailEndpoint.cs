using CSharpFunctionalExtensions;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using TrailMates.Application.Abstractions;
using TrailMates.Domain.Errors;
using IResult = Microsoft.AspNetCore.Http.IResult;

namespace TrailMates.Application.Features.Users.Queries.GetUserByEmail;

public class GetUserByEmailEndpoint : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder endpoints) =>
        endpoints
            .MapGroup("/api/users")
            .MapGet("", HandleGet)
            .WithName("get_user_by_email")
            .WithTags("Users");

    private static Task<IResult> HandleGet(
        string email,
        IMediator dispatcher,
        CancellationToken cancellationToken
    ) =>
        dispatcher
            .Send(new GetUserByEmailQuery(email), cancellationToken)
            .Match(Results.Ok, error => error.ToErrorProblemResult());
}
