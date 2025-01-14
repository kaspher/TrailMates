using CSharpFunctionalExtensions;
using TrailMates.Application.Abstractions.Repositories;
using TrailMates.Application.Mediator;
using TrailMates.Domain.Errors;

namespace TrailMates.Application.Features.Trails.Commands.UpdateTrailVisibility;

public readonly record struct UpdateTrailVisibilityCommand(Guid TrailId)
    : ICommand<UnitResult<Error>>;

internal sealed class UpdateTrailVisibilityCommandHandler(ITrailRepository trailRepository)
    : ICommandHandler<UpdateTrailVisibilityCommand, UnitResult<Error>>
{
    public async Task<UnitResult<Error>> Handle(
        UpdateTrailVisibilityCommand command,
        CancellationToken cancellationToken
    )
    {
        var visibilityUpdateResult = await trailRepository.UpdateVisibility(command.TrailId);

        if (visibilityUpdateResult.IsFailure)
            return visibilityUpdateResult.ConvertFailure<UnitResult<Error>>();

        return UnitResult.Success<Error>();
    }
}
