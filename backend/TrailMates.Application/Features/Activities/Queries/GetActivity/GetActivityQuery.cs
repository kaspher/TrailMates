using CSharpFunctionalExtensions;
using TrailMates.Application.Abstractions;
using TrailMates.Application.Abstractions.Repositories;
using TrailMates.Application.DTO;
using TrailMates.Application.Mappers;
using TrailMates.Application.Mediator;
using TrailMates.Domain.Errors;

namespace TrailMates.Application.Features.Activities.Queries.GetActivity;

public readonly record struct GetActivityQuery(Guid ActivityId)
    : IQuery<Result<ActivityDto, Error>>;

internal sealed class GetActivityQueryHandler(
    IActivityRepository repository,
    IUserRepository userRepository,
    IActivityService activityService
) : IQueryHandler<GetActivityQuery, Result<ActivityDto, Error>>
{
    public async Task<Result<ActivityDto, Error>> Handle(
        GetActivityQuery request,
        CancellationToken cancellationToken
    ) =>
        await repository
            .GetById(request.ActivityId, cancellationToken)
            .Map(t => t.ToDto(userRepository, activityService, cancellationToken));
}
