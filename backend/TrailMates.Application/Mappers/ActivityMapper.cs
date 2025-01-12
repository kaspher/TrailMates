using TrailMates.Application.Abstractions;
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
        IActivityService activityService,
        CancellationToken cancellationToken
    )
    {
        var ownerIds = activities.Items.Select(e => e.OwnerId).Distinct().ToList();

        var ownerResult = await userRepository.GetByIds(ownerIds, cancellationToken);

        var organizerMap = ownerResult.Value.ToDictionary(
            user => user.Id,
            user => $"{user.FirstName} {user.LastName}"
        );

        var activityDtos = new List<ActivityDto>();

        foreach (var activity in activities.Items)
        {
            var fullName = organizerMap.TryGetValue(activity.OwnerId, out var name)
                ? name
                : "Unknown Organizer";

            var pictures = await activityService.ListAllObjectsFromFolder(activity.Id.ToString());

            var activityDto = new ActivityDto(
                activity.Id,
                activity.Title,
                activity.Description,
                activity.OwnerId,
                fullName,
                activity.TrailId,
                activity.Likes,
                activity.Comments,
                pictures,
                activity.CreatedAt
            );

            activityDtos.Add(activityDto);
        }

        return new PagedList<ActivityDto>(
            activityDtos,
            activities.Page,
            activities.PageSize,
            activities.TotalCount
        );
    }

    public static async Task<ActivityDto> ToDto(
        this Activity activity,
        IUserRepository userRepository,
        IActivityService activityService,
        CancellationToken cancellationToken
    )
    {
        var ownerResult = await userRepository.GetById(activity.OwnerId, cancellationToken);

        var fullName = ownerResult.IsSuccess
            ? $"{ownerResult.Value.FirstName} {ownerResult.Value.LastName}"
            : "Unknown Organizer";

        var pictures = await activityService.ListAllObjectsFromFolder(activity.Id.ToString());

        return new ActivityDto(
            activity.Id,
            activity.Title,
            activity.Description,
            activity.OwnerId,
            fullName,
            activity.TrailId,
            activity.Likes,
            activity.Comments,
            pictures,
            activity.CreatedAt
        );
    }
}
