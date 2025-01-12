using CSharpFunctionalExtensions;
using TrailMates.Application.Abstractions.Repositories;
using TrailMates.Application.Common;
using TrailMates.Application.Features.Trails.Commands.Contracts;
using TrailMates.Application.Mediator;
using TrailMates.Domain.Errors;

namespace TrailMates.Application.Features.Trails.Commands.UpdateTrail;

public readonly record struct UpdateTrailCommand(UpdateTrailRequest Request)
    : ICommand<UnitResult<Error>>;

internal sealed class UpdateTrailCommandHandler(ITrailRepository trailRepository)
    : ICommandHandler<UpdateTrailCommand, UnitResult<Error>>
{
    public async Task<UnitResult<Error>> Handle(
        UpdateTrailCommand command,
        CancellationToken cancellationToken
    )
    {
        var trailResult = await trailRepository.GetById(command.Request.TrailId, cancellationToken);
        if (trailResult.IsFailure)
            return trailResult.ConvertFailure<UnitResult<Error>>();

        trailResult.Value.Overwrite(command.Request.UpdateBody);
        await trailRepository.Update(trailResult.Value);
        return UnitResult.Success<Error>();
    }
}
