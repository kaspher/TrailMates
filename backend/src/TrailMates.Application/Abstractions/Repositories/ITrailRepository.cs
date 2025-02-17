using CSharpFunctionalExtensions;
using TrailMates.Application.Features.Trails.Queries.GetTrails;
using TrailMates.Application.Features.Trails.Queries.GetTrailsCompletions;
using TrailMates.Domain.Entities.Trails;
using TrailMates.Domain.Errors;

namespace TrailMates.Application.Abstractions.Repositories;

public interface ITrailRepository
{
    Task<UnitResult<Error>> Exists(Guid trailId);
    Task<List<Trail>> GetAllOwnerships(
        GetTrailsRequest request,
        CancellationToken cancellationToken = default
    );

    Task<List<TrailCompletion>> GetAllCompletions(
        GetTrailsCompletionsRequest request,
        CancellationToken cancellationToken = default
    );
    Task<Result<Trail, Error>> GetById(Guid id, CancellationToken cancellationToken = default);
    Task<Result<List<Trail>, Error>> GetByIds(
        List<Guid> ids,
        CancellationToken cancellationToken = default
    );
    Task Add(Trail trail);
    Task Update(Trail trail);
    Task Delete(Trail trail);
    Task<UnitResult<Error>> UpdateVisibility(Guid trailId);
}
