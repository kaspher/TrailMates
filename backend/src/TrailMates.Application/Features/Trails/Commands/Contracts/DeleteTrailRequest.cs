using FluentValidation;
using TrailMates.Application.Features.Trails.Commands.DeleteTrail;

namespace TrailMates.Application.Features.Trails.Commands.Contracts;

public record DeleteTrailRequest(Guid TrailId)
{
    public DeleteTrailCommand ToCommand() => new(this);

    public class Validator : AbstractValidator<DeleteTrailRequest>
    {
        public Validator()
        {
            RuleFor(x => x.TrailId).NotEmpty();
        }
    }
}
