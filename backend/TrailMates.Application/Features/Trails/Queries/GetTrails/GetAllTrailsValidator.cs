using System.Collections.Immutable;
using CSharpFunctionalExtensions;
using FluentValidation;
using MediatR;
using TrailMates.Application.DTO;
using TrailMates.Core.Errors;

namespace TrailMates.Application.Features.Trails.Queries.GetTrails;

public sealed class GetAllTrailsQueryValidator : AbstractValidator<GetAllTrailsQuery>
{
    public GetAllTrailsQueryValidator() { }
}

public class GetAllTrailsValidator(IValidator<GetAllTrailsQuery> validator)
    : IPipelineBehavior<GetAllTrailsQuery, Result<ImmutableList<TrailDto>, Error>>
{
    public async Task<Result<ImmutableList<TrailDto>, Error>> Handle(
        GetAllTrailsQuery request,
        RequestHandlerDelegate<Result<ImmutableList<TrailDto>, Error>> next,
        CancellationToken cancellationToken
    )
    {
        var validationResult = await validator.ValidateAsync(request, cancellationToken);

        return validationResult.IsValid
            ? await next()
            : Errors.Validation("Cannot get all users", validationResult.ToDictionary());
    }
}
