using TrailMates.Application.Abstractions.Repositories;
using TrailMates.Application.DTO;
using TrailMates.Application.Specifications.Common;
using TrailMates.Domain.Entities.Activities;

namespace TrailMates.Application.Mappers;

public static class ActivityMapper
{
    public static async Task<PagedList<ActivityDto>> ToDto(
        this PagedList<Activity> activities,
        IUserRepository userRepository,
        CancellationToken cancellationToken
    )
    {
        var ownerIds = activities.Items.Select(e => e.OwnerId).Distinct().ToList();

        var ownerResult = await userRepository.GetByIds(ownerIds, cancellationToken);

        var organizerMap = ownerResult.Value.ToDictionary(
            user => user.Id,
            user => $"{user.FirstName} {user.LastName}"
        );

        var activityDtos = activities
            .Items.Select(activity =>
            {
                var fullName = organizerMap.TryGetValue(activity.OwnerId, out var name)
                    ? name
                    : "Unknown Organizer";

                return new ActivityDto(
                    activity.Id,
                    activity.Title,
                    activity.Description,
                    activity.OwnerId,
                    fullName,
                    activity.TrailId,
                    activity.Likes,
                    activity.Comments,
                    activity.CreatedAt
                );
            })
            .ToList();

        return new PagedList<ActivityDto>(
            activityDtos,
            activities.Page,
            activities.PageSize,
            activities.TotalCount
        );
    }
}
