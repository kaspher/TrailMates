using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using TrailMates.Application.Features.Events.Commands.JoinEvent;
using TrailMates.Application.Features.Events.Commands.LeaveEvent;

namespace TrailMates.Application.Features.Events.Commands.Contracts;

public record EventRequest([FromRoute] Guid EventId, [FromBody] Guid UserId)
{
    public JoinEventCommand ToJoinCommand() => new(this);

    public LeaveEventCommand ToLeaveCommand() => new(this);

    public class Validator : AbstractValidator<EventRequest>
    {
        public Validator()
        {
            RuleFor(x => x.EventId).NotEmpty();
            RuleFor(x => x.UserId).NotEmpty();
        }
    }
}
