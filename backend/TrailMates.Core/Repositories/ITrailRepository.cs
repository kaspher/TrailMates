using System.Collections.Immutable;
using CSharpFunctionalExtensions;
using TrailMates.Core.Entities;
using TrailMates.Core.Errors;
using TrailMates.Core.ValueObjects;

namespace TrailMates.Core.Repositories;

public interface ITrailRepository
{
    Task<ImmutableList<Trail>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Result<Trail, Error>> GetByIdAsync(
        TrailId id,
        CancellationToken cancellationToken = default
    );
}
