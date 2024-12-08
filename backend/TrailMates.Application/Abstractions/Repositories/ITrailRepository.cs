using System.Collections.Immutable;
using CSharpFunctionalExtensions;
using TrailMates.Domain.Entities.Trails;
using TrailMates.Domain.Errors;

namespace TrailMates.Application.Abstractions.Repositories;

public interface ITrailRepository
{
    Task<UnitResult<Error>> Exists(Guid trailId);
    Task<ImmutableList<Trail>> GetAll(CancellationToken cancellationToken = default);
    Task<Result<Trail, Error>> GetById(Guid id, CancellationToken cancellationToken = default);
}
