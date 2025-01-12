using CSharpFunctionalExtensions;
using TrailMates.Application.Features.Activities.Queries.GetActivities;
using TrailMates.Application.Specifications.Common;
using TrailMates.Domain.Entities.Activities;
using TrailMates.Domain.Errors;

namespace TrailMates.Application.Abstractions.Repositories;

public interface IActivityRepository
{
    Task<UnitResult<Error>> Exists(Guid id);

    Task<Result<PagedList<Activity>, Error>> GetAll(
        GetActivitiesRequest request,
        CancellationToken cancellationToken = default
    );

    Task<Result<Activity, Error>> GetById(Guid id, CancellationToken cancellationToken = default);

    Task<UnitResult<Error>> HasAlreadyLiked(Guid activityId, Guid userId);
    Task AddActivity(Activity activity);
    Task<UnitResult<Error>> LikeExists(Guid id);
    Task AddLike(Like like);
    Task DeleteLike(Guid id);
    Task<UnitResult<Error>> CommentExists(Guid id);
    Task AddComment(Comment comment);
    Task DeleteComment(Guid id);
}
