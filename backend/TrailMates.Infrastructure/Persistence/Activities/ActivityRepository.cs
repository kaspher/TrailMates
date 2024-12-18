using CSharpFunctionalExtensions;
using Microsoft.EntityFrameworkCore;
using TrailMates.Application.Abstractions.Repositories;
using TrailMates.Application.Features.Activities.Queries;
using TrailMates.Application.Features.Activities.Queries.GetActivities;
using TrailMates.Application.Specifications.Common;
using TrailMates.Domain.Entities.Activities;
using TrailMates.Domain.Errors;
using TrailMates.Infrastructure.Common.Persistence;

namespace TrailMates.Infrastructure.Persistence.Activities;

internal sealed class ActivityRepository(CoreDbContext dbContext) : IActivityRepository
{
    private readonly DbSet<Activity> _activities = dbContext.Activities;

    public async Task<Result<PagedList<Activity>, Error>> GetAll(
        GetActivitiesRequest request,
        CancellationToken cancellationToken = default
    )
    {
        var activitiesQuery = _activities
            .Include(a => a.Comments)
            .Include(a => a.Likes)
            .AsNoTracking();

        var activities = await PagedList<Activity>.CreateAsync(
            activitiesQuery,
            request.Page,
            request.PageSize
        );

        return Result.Success<PagedList<Activity>, Error>(activities);
    }

    public async Task AddActivity(Activity activity)
    {
        await _activities.AddAsync(activity);
        await dbContext.SaveChangesAsync();
    }
}
