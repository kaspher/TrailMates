using TrailMates.Core.Entities;
using TrailMates.Core.ValueObjects;

namespace TrailMates.Core.Repositories;

public interface ITrailRepository
{
    Task<IEnumerable<Trail>> GetAllAsync();
    Task<Trail> GetByIdAsync(TrailId id);
}