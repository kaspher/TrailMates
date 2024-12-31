using CSharpFunctionalExtensions;
using TrailMates.Application.Features.Trails.Queries.GetTrails;
using TrailMates.Domain.Entities.Trails;
using TrailMates.Domain.Errors;

namespace TrailMates.Application.Abstractions.Repositories;

public interface ITrailRepository
{
    Task<UnitResult<Error>> Exists(Guid trailId);
    Task<List<Trail>> GetAll(
        GetTrailsRequest request,
        CancellationToken cancellationToken = default
    );
    Task<Result<Trail, Error>> GetById(Guid id, CancellationToken cancellationToken = default);
    Task Add(Trail trail);
}
