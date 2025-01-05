using CSharpFunctionalExtensions;
using TrailMates.Application.Abstractions.Repositories;
using TrailMates.Application.Features.Activities.Commands.Contracts;
using TrailMates.Application.Mediator;
using TrailMates.Domain.Errors;

namespace TrailMates.Application.Features.Activities.Commands.DeleteLike;

public readonly record struct DeleteLikeCommand(DeleteLikeRequest Request)
    : ICommand<UnitResult<Error>>;

internal sealed class DeleteLikeCommandHandler(IActivityRepository activityRepository)
    : ICommandHandler<DeleteLikeCommand, UnitResult<Error>>
{
    public async Task<UnitResult<Error>> Handle(
        DeleteLikeCommand command,
        CancellationToken cancellationToken
    )
    {
        var request = command.Request;

        var likeExistsResult = await activityRepository.LikeExists(request.LikeId);
        if (likeExistsResult.IsFailure)
            return likeExistsResult.ConvertFailure<UnitResult<Error>>();

        await activityRepository.DeleteLike(request.LikeId);
        return UnitResult.Success<Error>();
    }
}
