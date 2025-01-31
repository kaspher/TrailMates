using CSharpFunctionalExtensions;
using TrailMates.Application.Abstractions.Repositories;
using TrailMates.Application.Features.Trails.Commands.Contracts;
using TrailMates.Application.Mediator;
using TrailMates.Domain.Entities.Trails;
using TrailMates.Domain.Errors;

namespace TrailMates.Application.Features.Trails.Commands.AddTrailCompletion;

public readonly record struct AddTrailCompletionCommand(
    Guid TrailId,
    AddTrailCompletionRequest Request
) : ICommand<UnitResult<Error>>;

internal sealed class AddTrailCompletionCommandHandler(
    IUserRepository userRepository,
    ITrailRepository trailRepository
) : ICommandHandler<AddTrailCompletionCommand, UnitResult<Error>>
{
    public async Task<UnitResult<Error>> Handle(
        AddTrailCompletionCommand command,
        CancellationToken cancellationToken
    )
    {
        var trailResult = await trailRepository.GetById(command.TrailId, cancellationToken);
        if (trailResult.IsFailure)
            return trailResult.ConvertFailure<UnitResult<Error>>();

        var userExistsResult = await userRepository.Exists(command.Request.UserId);
        if (userExistsResult.IsFailure)
            return userExistsResult.ConvertFailure<UnitResult<Error>>();

        trailResult.Value.TrailCompletions.Add(
            new TrailCompletion(
                Guid.NewGuid(),
                command.TrailId,
                command.Request.UserId,
                command.Request.Time
            )
        );

        await trailRepository.Update(trailResult.Value);

        return UnitResult.Success<Error>();
    }
}
