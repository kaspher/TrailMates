using System.Collections.Immutable;
using CSharpFunctionalExtensions;
using TrailMates.Application.Common.Interfaces;
using TrailMates.Application.DTO;
using TrailMates.Application.Mappers;
using TrailMates.Application.Mediator;
using TrailMates.Domain.Errors;
using Result = CSharpFunctionalExtensions.Result;

namespace TrailMates.Application.Features.Trails.Queries.GetTrails;

public readonly record struct GetAllTrailsQuery : IQuery<Result<ImmutableList<TrailDto>, Error>>;

internal sealed class GetAllTrailsHandler(ITrailRepository repository)
    : IQueryHandler<GetAllTrailsQuery, Result<ImmutableList<TrailDto>, Error>>
{
    public async Task<Result<ImmutableList<TrailDto>, Error>> Handle(
        GetAllTrailsQuery request,
        CancellationToken cancellationToken
    )
    {
        var trails = await repository.GetAllAsync(cancellationToken);
        var trailsDto = trails.Select(TrailMapper.ToDto).ToImmutableList();

        return Result.Success<ImmutableList<TrailDto>, Error>(trailsDto);
    }
}
