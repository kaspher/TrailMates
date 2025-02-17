using CSharpFunctionalExtensions;
using TrailMates.Application.Abstractions.Repositories;
using TrailMates.Application.Features.Trails.Commands.Contracts;
using TrailMates.Application.Mediator;
using TrailMates.Domain.Entities.Trails;
using TrailMates.Domain.Errors;

namespace TrailMates.Application.Features.Trails.Commands.DeleteTrail;

public readonly record struct DeleteTrailCommand(DeleteTrailRequest Request)
    : ICommand<UnitResult<Error>>;

internal sealed class DeleteTrailCommandHandler(ITrailRepository trailRepository)
    : ICommandHandler<DeleteTrailCommand, UnitResult<Error>>
{
    public async Task<UnitResult<Error>> Handle(
        DeleteTrailCommand command,
        CancellationToken cancellationToken
    )
    {
        var trailExistsResult = await trailRepository.GetById(
            command.Request.TrailId,
            cancellationToken
        );

        if (trailExistsResult.IsFailure)
            return trailExistsResult.ConvertFailure<UnitResult<Error>>();

        if (trailExistsResult.Value.Visibility != VisibilityType.Private)
            return UnitResult.Failure(
                ErrorsTypes.BadRequest("Trail visibility has to be private.")
            );

        await trailRepository.Delete(trailExistsResult.Value);

        return UnitResult.Success<Error>();
    }
}
