using System.Collections.Immutable;
using CSharpFunctionalExtensions;
using TrailMates.Application.Abstractions.Repositories;
using TrailMates.Application.DTO;
using TrailMates.Application.Mappers;
using TrailMates.Application.Mediator;
using TrailMates.Domain.Errors;
using Result = CSharpFunctionalExtensions.Result;

namespace TrailMates.Application.Features.Trails.Queries.GetTrails;

public readonly record struct GetTrailsQuery : IQuery<Result<ImmutableList<TrailDto>, Error>>;

internal sealed class GetTrailsQueryHandler(ITrailRepository repository)
    : IQueryHandler<GetTrailsQuery, Result<ImmutableList<TrailDto>, Error>>
{
    public async Task<Result<ImmutableList<TrailDto>, Error>> Handle(
        GetTrailsQuery request,
        CancellationToken cancellationToken
    )
    {
        var trails = await repository.GetAll(cancellationToken);

        return Result.Success<ImmutableList<TrailDto>, Error>(trails.ToDto());
    }
}
