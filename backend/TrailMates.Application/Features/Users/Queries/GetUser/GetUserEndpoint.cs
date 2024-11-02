using CSharpFunctionalExtensions;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using TrailMates.Application.Abstractions;
using TrailMates.Application.Common;
using TrailMates.Domain.Errors;
using IResult = Microsoft.AspNetCore.Http.IResult;

namespace TrailMates.Application.Features.Users.Queries.GetUser;

public class GetUserEndpoint : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder endpoints) =>
        endpoints
            .MapGroup("/api/users")
            .MapGet("/{userId}", HandleGet)
            .WithName("get_user")
            .WithTags(Constants.UsersTag);

    private static Task<IResult> HandleGet(
        Guid userId,
        IMediator dispatcher,
        CancellationToken cancellationToken
    ) =>
        dispatcher
            .Send(new GetUserQuery(userId), cancellationToken)
            .Match(Results.Ok, error => error.ToErrorProblemResult());
}
