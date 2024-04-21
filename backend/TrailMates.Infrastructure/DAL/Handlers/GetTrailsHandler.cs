using TrailMates.Application.Abstractions;
using TrailMates.Application.DTO;
using TrailMates.Application.Queries;
using TrailMates.Core.Repositories;

namespace TrailMates.Infrastructure.DAL.Handlers;

public class GetTrailsHandler(ITrailRepository repository) : IQueryHandler<GetTrails, IEnumerable<TrailDto>>
{
    public async Task<IEnumerable<TrailDto>> HandleAsync(GetTrails query)
    {
        var trails = await repository.GetAllAsync();
        return trails.Select(x => x.AsDto());
    }
}