using FluentValidation;
using TrailMates.Application.Features.Events.Commands.AddEvent;

namespace TrailMates.Application.Features.Events.Commands.Contracts;

public record AddEventRequest(
    string Name,
    string Description,
    Guid OrganizerId,
    Guid TrailId,
    DateTime StartDate,
    DateTime EndDate,
    int? ParticipantsLimit = null
)
{
    public AddEventCommand ToCommand() =>
        new(this with { ParticipantsLimit = ParticipantsLimit ?? int.MaxValue });

    public class Validator : AbstractValidator<AddEventRequest>
    {
        public Validator()
        {
            RuleFor(x => x.Name).NotEmpty();
            RuleFor(x => x.Description).NotEmpty().MinimumLength(20);
            RuleFor(x => x.OrganizerId).NotEmpty();
            RuleFor(x => x.TrailId).NotEmpty();
            RuleFor(x => x.StartDate).Must(date => date >= DateTime.Now.AddHours(1));
            RuleFor(x => x.EndDate).GreaterThan(x => x.StartDate);
            RuleFor(x => x.ParticipantsLimit)
                .GreaterThanOrEqualTo(1)
                .When(x => x.ParticipantsLimit.HasValue);
        }
    }
}
