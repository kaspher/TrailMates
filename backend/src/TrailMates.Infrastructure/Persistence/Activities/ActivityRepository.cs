using CSharpFunctionalExtensions;
using Microsoft.EntityFrameworkCore;
using TrailMates.Application.Abstractions.Repositories;
using TrailMates.Application.Features.Activities.Queries.GetActivities;
using TrailMates.Application.Specifications.Common;
using TrailMates.Domain.Entities.Activities;
using TrailMates.Domain.Errors;
using TrailMates.Infrastructure.Common.Persistence;

namespace TrailMates.Infrastructure.Persistence.Activities;

internal sealed class ActivityRepository(CoreDbContext dbContext) : IActivityRepository
{
    private readonly DbSet<Activity> _activities = dbContext.Activities;
    private readonly DbSet<Like> _likes = dbContext.Likes;
    private readonly DbSet<Comment> _comments = dbContext.Comments;

    public async Task<UnitResult<Error>> Exists(Guid id)
    {
        var exists = await _activities.AnyAsync(x => x.Id == id);

        return exists
            ? UnitResult.Success<Error>()
            : UnitResult.Failure(ErrorsTypes.NotFound($"Activity with id {id} was not found"));
    }

    public async Task<Result<PagedList<Activity>, Error>> GetAll(
        GetActivitiesRequest request,
        CancellationToken cancellationToken = default
    )
    {
        var activitiesQuery = _activities
            .Include(a => a.Comments)
            .Include(a => a.Likes)
            .OrderByDescending(a => a.CreatedAt)
            .AsNoTracking();

        var activities = await PagedList<Activity>.CreateFromQuery(
            activitiesQuery,
            request.Page,
            request.PageSize
        );

        return Result.Success<PagedList<Activity>, Error>(activities);
    }

    public async Task<Result<Activity, Error>> GetById(
        Guid id,
        CancellationToken cancellationToken = default
    )
    {
        var entity = await _activities
            .Include(a => a.Comments)
            .Include(a => a.Likes)
            .FirstOrDefaultAsync(x => x.Id == id, cancellationToken);

        return entity is null
            ? Result.Failure<Activity, Error>(
                ErrorsTypes.NotFound($"Activity with id: {id} has not been found")
            )
            : Result.Success<Activity, Error>(entity);
    }

    public async Task<UnitResult<Error>> HasAlreadyLiked(Guid activityId, Guid userId)
    {
        var liked = await _activities
            .Include(a => a.Likes)
            .AnyAsync(a => a.Likes.Any(l => l.ActivityId == activityId && l.UserId == userId));

        return liked
            ? UnitResult.Success<Error>()
            : UnitResult.Failure(
                ErrorsTypes.BadRequest(
                    $"User with id {userId} already liked activity with id {activityId}"
                )
            );
    }

    public async Task AddActivity(Activity activity)
    {
        await _activities.AddAsync(activity);
        await dbContext.SaveChangesAsync();
    }

    public async Task<UnitResult<Error>> LikeExists(Guid id)
    {
        var exists = await _activities
            .Include(a => a.Likes)
            .AnyAsync(a => a.Likes.Any(l => l.Id == id));

        return exists
            ? UnitResult.Success<Error>()
            : UnitResult.Failure(ErrorsTypes.NotFound($"Like with id {id} does not exists"));
    }

    public async Task AddLike(Like like)
    {
        await _likes.AddAsync(like);
        await dbContext.SaveChangesAsync();
    }

    public async Task DeleteLike(Guid id)
    {
        await _likes.Where(l => l.Id == id).ExecuteDeleteAsync();
        await dbContext.SaveChangesAsync();
    }

    public async Task<UnitResult<Error>> CommentExists(Guid id)
    {
        var exists = await _activities
            .Include(a => a.Comments)
            .AnyAsync(a => a.Comments.Any(c => c.Id == id));

        return exists
            ? UnitResult.Success<Error>()
            : UnitResult.Failure(ErrorsTypes.NotFound($"Comment with id {id} does not exists"));
    }

    public async Task AddComment(Comment comment)
    {
        await _comments.AddAsync(comment);
        await dbContext.SaveChangesAsync();
    }

    public async Task DeleteComment(Guid id)
    {
        await _comments.Where(c => c.Id == id).ExecuteDeleteAsync();
        await dbContext.SaveChangesAsync();
    }
}
