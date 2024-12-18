using CSharpFunctionalExtensions;
using TrailMates.Application.Abstractions.Repositories;
using TrailMates.Application.DTO;
using TrailMates.Application.Mappers;
using TrailMates.Application.Mediator;
using TrailMates.Application.Specifications.Common;
using TrailMates.Domain.Errors;

namespace TrailMates.Application.Features.Activities.Queries.GetActivities;

public readonly record struct GetActivitiesQuery(GetActivitiesRequest Data)
    : IQuery<Result<PagedList<ActivityDto>, Error>>;

internal sealed class GetActivitiesQueryHandler(
    IActivityRepository activityRepository,
    IUserRepository userRepository
) : IQueryHandler<GetActivitiesQuery, Result<PagedList<ActivityDto>, Error>>
{
    public async Task<Result<PagedList<ActivityDto>, Error>> Handle(
        GetActivitiesQuery request,
        CancellationToken cancellationToken
    )
    {
        var activities = await activityRepository.GetAll(request.Data, cancellationToken);

        var activitiesDtos = await activities.Value.ToDto(userRepository, cancellationToken);

        return Result.Success<PagedList<ActivityDto>, Error>(activitiesDtos);
    }
}
