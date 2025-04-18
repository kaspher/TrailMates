﻿using CSharpFunctionalExtensions;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using TrailMates.Application.Abstractions;
using TrailMates.Application.Common;
using TrailMates.Application.Features.Trails.Commands.Contracts;
using TrailMates.Domain.Errors;
using IResult = Microsoft.AspNetCore.Http.IResult;

namespace TrailMates.Application.Features.Trails.Commands.UpdateTrail;

internal sealed class UpdateTrailEndpoint : IEndpoint
{
    public static void MapEndpoint(IEndpointRouteBuilder endpoints) =>
        endpoints
            .MapGroup("/api/trails")
            .MapPut("/{trailId}", HandlePut)
            .WithName("update-trail")
            .WithTags(Constants.TrailsTag);

    private static Task<IResult> HandlePut(
        [AsParameters] UpdateTrailRequest request,
        IMediator dispatcher,
        IValidator<UpdateTrailRequest> validator,
        CancellationToken cancellationToken
    ) =>
        validator
            .Validate(request)
            .ToInputValidationResult()
            .Bind(() => dispatcher.Send(request.ToCommand(), cancellationToken))
            .Match(Results.NoContent, error => error.ToErrorProblemResult());
}
