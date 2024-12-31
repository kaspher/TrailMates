using CSharpFunctionalExtensions;
using Microsoft.EntityFrameworkCore;
using TrailMates.Application.Abstractions.Repositories;
using TrailMates.Application.Features.Trails.Queries.GetTrails;
using TrailMates.Application.Specifications.Trails;
using TrailMates.Domain.Entities.Trails;
using TrailMates.Domain.Errors;
using TrailMates.Infrastructure.Common.Persistence;

namespace TrailMates.Infrastructure.Persistence.Trails;

public sealed class TrailRepository(CoreDbContext dbContext) : ITrailRepository
{
    private readonly DbSet<Trail> _trails = dbContext.Trails;

    public async Task<UnitResult<Error>> Exists(Guid trailId)
    {
        var exists = await _trails.AnyAsync(x => x.Id == trailId);

        return exists
            ? UnitResult.Success<Error>()
            : UnitResult.Failure(ErrorsTypes.NotFound($"Trail with id {trailId} was not found"));
    }

    public async Task<List<Trail>> GetAll(
        GetTrailsRequest request,
        CancellationToken cancellationToken = default
    )
    {
        var trails = await _trails.ToListAsync(cancellationToken);

        var filteredTrails = trails.ApplyFilters(
            request.MinimumLatitude,
            request.MaximumLatitude,
            request.MinimumLongitude,
            request.MaximumLongitude,
            request.TrailTypes,
            request.Visibility
        );

        return filteredTrails.ToList();
    }

    public async Task<Result<Trail, Error>> GetById(
        Guid id,
        CancellationToken cancellationToken = default
    )
    {
        var entity = await _trails.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        return entity is null
            ? Result.Failure<Trail, Error>(
                ErrorsTypes.NotFound($"Trail with id: {id} has not been found")
            )
            : Result.Success<Trail, Error>(entity);
    }

    public async Task Add(Trail trail)
    {
        await _trails.AddAsync(trail);
        await dbContext.SaveChangesAsync();
    }
}
