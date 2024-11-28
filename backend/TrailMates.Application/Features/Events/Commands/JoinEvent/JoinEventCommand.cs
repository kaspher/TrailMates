using CSharpFunctionalExtensions;
using TrailMates.Application.Abstractions.Repositories;
using TrailMates.Application.Features.Events.Commands.Contracts;
using TrailMates.Application.Mediator;
using TrailMates.Domain.Errors;
using static TrailMates.Domain.Services.Validators.EventValidator;

namespace TrailMates.Application.Features.Events.Commands.JoinEvent;

public readonly record struct JoinEventCommand(JoinEventRequest Request)
    : ICommand<UnitResult<Error>>;

internal sealed class JoinEventCommandHandler(IEventRepository eventRepository)
    : ICommandHandler<JoinEventCommand, UnitResult<Error>>
{
    public async Task<UnitResult<Error>> Handle(
        JoinEventCommand command,
        CancellationToken cancellationToken
    )
    {
        var eventResult = await eventRepository.GetById(command.Request.EventId, cancellationToken);

        if (eventResult.IsFailure)
            return eventResult.ConvertFailure<UnitResult<Error>>();

        var validationResult = ValidateJoinEvent(eventResult.Value, command.Request.UserId);

        if (validationResult.IsFailure)
            return validationResult.ConvertFailure<UnitResult<Error>>();

        var joinEventResult = await eventRepository.JoinEvent(
            eventResult.Value,
            command.Request.UserId
        );

        if (joinEventResult.IsFailure)
            return validationResult.ConvertFailure<UnitResult<Error>>();

        return UnitResult.Success<Error>();
    }
}
