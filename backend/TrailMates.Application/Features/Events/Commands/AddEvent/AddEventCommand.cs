using CSharpFunctionalExtensions;
using TrailMates.Application.Abstractions.Repositories;
using TrailMates.Application.Features.Events.Commands.Contracts;
using TrailMates.Application.Mediator;
using TrailMates.Domain.Entities.Events;
using TrailMates.Domain.Errors;

namespace TrailMates.Application.Features.Events.Commands.AddEvent;

public readonly record struct AddEventCommand(AddEventRequest Request)
    : ICommand<UnitResult<Error>>;

internal sealed class AddEventCommandHandler(
    IEventRepository eventRepository,
    ITrailRepository trailRepository
) : ICommandHandler<AddEventCommand, UnitResult<Error>>
{
    public async Task<UnitResult<Error>> Handle(
        AddEventCommand command,
        CancellationToken cancellationToken
    )
    {
        var trailExistsResult = await trailRepository.Exists(command.Request.TrailId);
        if (trailExistsResult.IsFailure)
            return trailExistsResult.ConvertFailure<UnitResult<Error>>();

        var addEventResult = await eventRepository.AddEvent(
            new Event(
                Guid.NewGuid(),
                command.Request.Name,
                command.Request.Description,
                command.Request.OrganizerId,
                command.Request.TrailId,
                command.Request.StartDate,
                command.Request.EndDate,
                command.Request.ParticipantsLimit ?? int.MaxValue
            )
        );

        if (addEventResult.IsFailure)
            return addEventResult.ConvertFailure<UnitResult<Error>>();

        return UnitResult.Success<Error>();
    }
}
