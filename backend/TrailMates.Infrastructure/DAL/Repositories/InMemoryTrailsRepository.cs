using TrailMates.Core.Entities;
using TrailMates.Core.Repositories;
using TrailMates.Core.ValueObjects;

namespace TrailMates.Infrastructure.DAL.Repositories;

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
            Trail.Create(Guid.Parse("00000000-0000-0000-0000-000000000001"), coordinates),
            Trail.Create(Guid.Parse("00000000-0000-0000-0000-000000000002"), coordinates2)
        ];
    }

    public async Task<IEnumerable<Trail>> GetAllAsync()
    {
        await Task.CompletedTask;
        return _trails;
    }

    public async Task<Trail> GetByIdAsync(TrailId id)
    {
        await Task.CompletedTask;
        return _trails.SingleOrDefault(x => x.Id == id);
    }
}