using CSharpFunctionalExtensions;
using TrailMates.Application.Abstractions.Repositories;
using TrailMates.Application.Features.Activities.Commands.Contracts;
using TrailMates.Application.Mediator;
using TrailMates.Domain.Entities.Activities;
using TrailMates.Domain.Errors;

namespace TrailMates.Application.Features.Activities.Commands.AddActivity;

public readonly record struct AddActivityCommand(AddActivityRequest Request)
    : ICommand<UnitResult<Error>>;

internal sealed class AddActivityCommandHandler(
    IActivityRepository activityRepository,
    IUserRepository userRepository,
    ITrailRepository trailRepository
) : ICommandHandler<AddActivityCommand, UnitResult<Error>>
{
    public async Task<UnitResult<Error>> Handle(
        AddActivityCommand command,
        CancellationToken cancellationToken
    )
    {
        var userExistsResult = await userRepository.Exists(command.Request.OwnerId);
        if (userExistsResult.IsFailure)
            return userExistsResult.ConvertFailure<UnitResult<Error>>();

        var trailExistsResult = await trailRepository.Exists(command.Request.TrailId);
        if (trailExistsResult.IsFailure)
            return trailExistsResult.ConvertFailure<UnitResult<Error>>();

        await activityRepository.AddActivity(
            new Activity(
                Guid.NewGuid(),
                command.Request.Title,
                command.Request.Description,
                command.Request.OwnerId,
                command.Request.TrailId
            )
        );

        return UnitResult.Success<Error>();
    }
}
