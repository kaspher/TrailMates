using CSharpFunctionalExtensions;
using TrailMates.Application.Abstractions.Repositories;
using TrailMates.Application.Features.Events.Commands.Contracts;
using TrailMates.Application.Mediator;
using TrailMates.Domain.Errors;

namespace TrailMates.Application.Features.Events.Commands.LeaveEvent;

public readonly record struct LeaveEventCommand(EventRequest Request) : ICommand<UnitResult<Error>>;

internal sealed class LeaveEventCommandHandler(IEventRepository eventRepository)
    : ICommandHandler<LeaveEventCommand, UnitResult<Error>>
{
    public async Task<UnitResult<Error>> Handle(
        LeaveEventCommand command,
        CancellationToken cancellationToken
    )
    {
        var eventResult = await eventRepository.GetById(command.Request.EventId, cancellationToken);

        if (eventResult.IsFailure)
            return eventResult.ConvertFailure<UnitResult<Error>>();

        if (!eventResult.Value.ParticipantsIds.Contains(command.Request.UserId))
            return UnitResult.Failure(
                ErrorsTypes.BadRequest(
                    $"User with id {command.Request.UserId} isn't participating in event with id {eventResult.Value.Id}"
                )
            );

        var leaveEventResult = await eventRepository.LeaveEvent(
            eventResult.Value,
            command.Request.UserId
        );

        if (leaveEventResult.IsFailure)
            return leaveEventResult.ConvertFailure<UnitResult<Error>>();

        return UnitResult.Success<Error>();
    }
}
