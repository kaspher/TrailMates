using CSharpFunctionalExtensions;
using TrailMates.Application.Abstractions.Repositories;
using TrailMates.Application.Features.Activities.Commands.Contracts;
using TrailMates.Application.Mediator;
using TrailMates.Domain.Entities.Activities;
using TrailMates.Domain.Errors;

namespace TrailMates.Application.Features.Activities.Commands.AddLike;

public readonly record struct AddLikeCommand(AddLikeRequest Request) : ICommand<UnitResult<Error>>;

internal sealed class AddLikeCommandHandler(
    IActivityRepository activityRepository,
    IUserRepository userRepository
) : ICommandHandler<AddLikeCommand, UnitResult<Error>>
{
    public async Task<UnitResult<Error>> Handle(
        AddLikeCommand command,
        CancellationToken cancellationToken
    )
    {
        var request = command.Request;
        var userExistsResult = await userRepository.Exists(request.UserId);
        if (userExistsResult.IsFailure)
            return userExistsResult.ConvertFailure<UnitResult<Error>>();

        var activityExistsResult = await activityRepository.Exists(request.ActivityId);
        if (activityExistsResult.IsFailure)
            return activityExistsResult.ConvertFailure<UnitResult<Error>>();

        var alreadyLikedResult = await activityRepository.HasAlreadyLiked(
            request.ActivityId,
            request.UserId
        );

        if (alreadyLikedResult.IsSuccess)
            return UnitResult.Failure(
                ErrorsTypes.BadRequest($"User with id {request.UserId} has already liked")
            );

        await activityRepository.AddLike(
            new Like(Guid.NewGuid(), request.ActivityId, request.UserId)
        );

        return UnitResult.Success<Error>();
    }
}
