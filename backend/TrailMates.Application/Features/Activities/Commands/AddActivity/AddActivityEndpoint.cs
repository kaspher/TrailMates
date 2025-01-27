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

namespace TrailMates.Application.Features.Activities.Commands.AddActivity;

internal sealed class AddActivityEndpoint : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder endpoints) =>
        endpoints
            .MapGroup("/api/activities")
            .MapPost(
                "",
                async (
                    HttpRequest request,
                    IMediator dispatcher,
                    IValidator<AddActivityRequest> validator,
                    CancellationToken cancellationToken
                ) =>
                {
                    var form = await request.ReadFormAsync(cancellationToken);
                    var activityRequest = new AddActivityRequest(
                        form["title"]!,
                        form["description"]!,
                        Guid.Parse(form["ownerId"]!),
                        Guid.Parse(form["trailId"]!),
                        form.Files.GetFiles("pictures").ToList(),
                        Guid.Parse(form["trailCompletionId"]!),
                        bool.Parse(form["isTrailCompletion"]!)
                    );

                    return await (await validator.ValidateAsync(activityRequest, cancellationToken))
                        .ToInputValidationResult()
                        .Bind(() => dispatcher.Send(activityRequest.ToCommand(), cancellationToken))
                        .Match(Results.Ok, error => error.ToErrorProblemResult());
                }
            )
            .WithName("add-activity")
            .WithTags(Constants.ActivitiesTag)
            .DisableAntiforgery();
}
