using FluentValidation;
using TrailMates.Application.Features.Activities.Commands.AddActivity;

namespace TrailMates.Application.Features.Activities.Commands.Contracts;

public record AddActivityRequest(string Title, string Description, Guid OwnerId, Guid TrailId)
{
    public AddActivityCommand ToCommand() => new(this);

    public class Validator : AbstractValidator<AddActivityRequest>
    {
        public Validator()
        {
            RuleFor(x => x.Title).NotEmpty();
            RuleFor(x => x.Description).NotEmpty().MinimumLength(20);
            RuleFor(x => x.OwnerId).NotEmpty();
            RuleFor(x => x.TrailId).NotEmpty();
        }
    }
}
