using System.Collections.Immutable;
using CSharpFunctionalExtensions;
using TrailMates.Domain.Entities.Trails;
using TrailMates.Domain.Errors;

namespace TrailMates.Application.Abstractions;

public interface ITrailRepository
{
    Task<ImmutableList<Trail>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Result<Trail, Error>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
}
