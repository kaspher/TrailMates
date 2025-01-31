using CSharpFunctionalExtensions;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using TrailMates.Application.Abstractions;
using TrailMates.Application.Common;
using TrailMates.Domain.Errors;
using IResult = Microsoft.AspNetCore.Http.IResult;

namespace TrailMates.Application.Features.Trails.Queries.GetTrailsCompletions;

internal sealed class GetTrailsCompletionsEndpoint : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder endpoints) =>
        endpoints
            .MapGroup("/api/trails/completions")
            .MapGet("", HandleGet)
            .WithName("get-trails-completions")
            .WithTags(Constants.TrailsTag);

    private static Task<IResult> HandleGet(
        [AsParameters] GetTrailsCompletionsRequest request,
        IMediator dispatcher,
        CancellationToken cancellationToken
    ) =>
        dispatcher
            .Send(request.ToQuery(), cancellationToken)
            .Match(Results.Ok, error => error.ToErrorProblemResult());
}
