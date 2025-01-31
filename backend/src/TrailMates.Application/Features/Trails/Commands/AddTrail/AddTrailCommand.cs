using CSharpFunctionalExtensions;
using TrailMates.Application.Abstractions.Repositories;
using TrailMates.Application.Features.Trails.Commands.Contracts;
using TrailMates.Application.Mediator;
using TrailMates.Domain.Entities.Trails;
using TrailMates.Domain.Errors;

namespace TrailMates.Application.Features.Trails.Commands.AddTrail;

public readonly record struct AddTrailCommand(AddTrailRequest Request)
    : ICommand<UnitResult<Error>>;

internal sealed class AddTrailCommandHandler(
    IUserRepository userRepository,
    ITrailRepository trailRepository
) : ICommandHandler<AddTrailCommand, UnitResult<Error>>
{
    public async Task<UnitResult<Error>> Handle(
        AddTrailCommand command,
        CancellationToken cancellationToken
    )
    {
        var userExistsResult = await userRepository.Exists(command.Request.OwnerId);
        if (userExistsResult.IsFailure)
            return userExistsResult.ConvertFailure<UnitResult<Error>>();

        await trailRepository.Add(
            new Trail(
                Guid.NewGuid(),
                command.Request.Name,
                command.Request.OwnerId,
                command.Request.Type,
                command.Request.Time
            )
            {
                Coordinates = command.Request.Coordinates,
                TrailCompletions = []
            }
        );

        return UnitResult.Success<Error>();
    }
}
