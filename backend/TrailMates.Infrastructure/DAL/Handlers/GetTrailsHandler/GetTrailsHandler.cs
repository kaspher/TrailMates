using System.Collections.Immutable;
using TrailMates.Application.Abstractions;
using TrailMates.Application.DTO;
using TrailMates.Application.Features.Trails.Queries.GetTrails;
using TrailMates.Core.Repositories;

namespace TrailMates.Infrastructure.DAL.Handlers.GetTrailsHandler;

public class GetTrailsHandler(ITrailRepository repository) : IQueryHandler<GetTrails, IEnumerable<TrailDto>>
{
    public async Task<IEnumerable<TrailDto>> HandleAsync(GetTrails query)
    {
        var trails = await repository.GetAllAsync();
        return trails.Select(trail => trail.AsDto()).ToImmutableList();
    }
}