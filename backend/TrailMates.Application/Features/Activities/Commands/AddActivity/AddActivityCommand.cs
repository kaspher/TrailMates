using CSharpFunctionalExtensions;
using TrailMates.Application.Abstractions;
using TrailMates.Application.Abstractions.Repositories;
using TrailMates.Application.Features.Activities.Commands.Contracts;
using TrailMates.Application.Mediator;
using TrailMates.Domain.Entities.Activities;
using TrailMates.Domain.Errors;

namespace TrailMates.Application.Features.Activities.Commands.AddActivity;

public readonly record struct AddActivityCommand(AddActivityRequest Request)
    : ICommand<Result<Guid, Error>>;

internal sealed class AddActivityCommandHandler(
    IActivityRepository activityRepository,
    IUserRepository userRepository,
    ITrailRepository trailRepository,
    IActivityService activityService
) : ICommandHandler<AddActivityCommand, Result<Guid, Error>>
{
    public async Task<Result<Guid, Error>> Handle(
        AddActivityCommand command,
        CancellationToken cancellationToken
    )
    {
        var request = command.Request;

        var userExistsResult = await userRepository.Exists(request.OwnerId);
        if (userExistsResult.IsFailure)
            return userExistsResult.ConvertFailure<Guid>();

        var trailExistsResult = await trailRepository.Exists(request.TrailId);
        if (trailExistsResult.IsFailure)
            return trailExistsResult.ConvertFailure<Guid>();

        var visibilityUpdateResult = await trailRepository.UpdateVisibility(request.TrailId);

        if (visibilityUpdateResult.IsFailure)
            return visibilityUpdateResult.ConvertFailure<Guid>();

        var activityId = Guid.NewGuid();
        await activityRepository.AddActivity(
            new Activity(
                activityId,
                request.Title,
                request.Description,
                request.OwnerId,
                request.TrailId
            )
        );

        await activityService.CreateS3BucketFolder(activityId.ToString());

        var addPicturesResult = await activityService.AddActivityPictures(
            activityId.ToString(),
            request.Pictures
        );

        return addPicturesResult.IsFailure
            ? addPicturesResult.ConvertFailure<Guid>()
            : Result.Success<Guid, Error>(activityId);
    }
}
