using System.Collections.Immutable;
using CSharpFunctionalExtensions;
using TrailMates.Application.Abstractions.Repositories;
using TrailMates.Domain.Entities.Trails;
using TrailMates.Domain.Errors;

namespace TrailMates.Infrastructure.Persistence.Trails;

public sealed class InMemoryTrailRepository : ITrailRepository
{
    private readonly List<Trail> _trails =
    [
        new Trail(
            Guid.Parse("00000000-0000-0000-0000-000000000001"),
            [new Coordinate(50.0646501, 19.9449799), new Coordinate(50.049683, 19.944544)]
        ),
        new Trail(
            Guid.Parse("00000000-0000-0000-0000-000000000002"),
            [
                new Coordinate(54.18165622985657, 18.5760149400919),
                new Coordinate(54.35289089813254, 18.64575827824924)
            ]
        )
    ];

    public async Task<UnitResult<Error>> Exists(Guid trailId)
    {
        var exists = _trails.Any(x => x.Id == trailId);

        await Task.CompletedTask;
        return exists
            ? UnitResult.Success<Error>()
            : UnitResult.Failure(ErrorsTypes.NotFound($"Trail with id {trailId} was not found"));
    }

    public async Task<ImmutableList<Trail>> GetAll(CancellationToken cancellationToken = default)
    {
        await Task.CompletedTask;
        return _trails.ToImmutableList();
    }

    public async Task<Result<Trail, Error>> GetById(
        Guid id,
        CancellationToken cancellationToken = default
    )
    {
        var entity = _trails.SingleOrDefault(x => x.Id == id);
        await Task.CompletedTask;
        return entity is null
            ? Result.Failure<Trail, Error>(
                ErrorsTypes.NotFound($"Trail with id: {id} has not been found")
            )
            : Result.Success<Trail, Error>(entity);
    }
}
