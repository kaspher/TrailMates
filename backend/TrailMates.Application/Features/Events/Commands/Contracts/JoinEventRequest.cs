using FluentValidation;
using TrailMates.Application.Features.Events.Commands.JoinEvent;

namespace TrailMates.Application.Features.Events.Commands.Contracts;

public record JoinEventRequest(Guid EventId, Guid UserId)
{
    public JoinEventCommand ToCommand() => new(new(this));

    public class Validator : AbstractValidator<JoinEventRequest>
    {
        public Validator()
        {
            RuleFor(x => x.EventId).NotEmpty();
            RuleFor(x => x.UserId).NotEmpty();
        }
    }
}
