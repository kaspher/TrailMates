using FluentValidation;
using TrailMates.Application.Features.Trails.Commands.AddTrail;
using TrailMates.Domain.Entities.Trails;

namespace TrailMates.Application.Features.Trails.Commands.Contracts;

public record AddTrailRequest(Guid OwnerId, string Name, List<Coordinate> Coordinates)
{
    public AddTrailCommand ToCommand() => new(this);

    public class Validator : AbstractValidator<AddTrailRequest>
    {
        public Validator()
        {
            RuleFor(x => x.OwnerId).NotEmpty();
            RuleFor(x => x.Name).NotEmpty();
            RuleFor(x => x.Coordinates).Must(c => c.Count > 2);
        }
    }
}
