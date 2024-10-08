﻿using System.Collections.Immutable;
using CSharpFunctionalExtensions;
using TrailMates.Application.Abstractions;
using TrailMates.Domain.Entities.Trails;
using TrailMates.Domain.Errors;

namespace TrailMates.Infrastructure.Trails.Persistence;

public sealed class InMemoryTrailsRepository : ITrailRepository
{
    private readonly List<Trail> _trails;

    public InMemoryTrailsRepository()
    {
        List<Coordinate> coordinates =
        [
            new Coordinate(50.0646501, 19.9449799),
            new Coordinate(50.049683, 19.944544)
        ];

        List<Coordinate> coordinates2 =
        [
            new Coordinate(54.18165622985657, 18.5760149400919),
            new Coordinate(54.35289089813254, 18.64575827824924)
        ];

        _trails =
        [
            new Trail(Guid.Parse("00000000-0000-0000-0000-000000000001"), coordinates),
            new Trail(Guid.Parse("00000000-0000-0000-0000-000000000002"), coordinates2)
        ];
    }

    public async Task<ImmutableList<Trail>> GetAllAsync(
        CancellationToken cancellationToken = default
    )
    {
        await Task.CompletedTask;
        return _trails.ToImmutableList();
    }

    public async Task<Result<Trail, Error>> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default
    )
    {
        var entity = _trails.SingleOrDefault(x => x.Id == id);
        await Task.CompletedTask;
        return entity is null
            ? Result.Failure<Trail, Error>(
                Errors.NotFound($"Trail with id: {id} has not been found")
            )
            : Result.Success<Trail, Error>(entity);
    }
}
