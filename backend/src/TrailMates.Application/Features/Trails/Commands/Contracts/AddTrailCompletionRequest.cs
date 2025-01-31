using FluentValidation;

namespace TrailMates.Application.Features.Trails.Commands.Contracts;

public record AddTrailCompletionRequest(Guid UserId, TimeSpan Time)
{
    public class Validator : AbstractValidator<AddTrailCompletionRequest>
    {
        public Validator()
        {
            RuleFor(x => x.UserId).NotEmpty();
            RuleFor(x => x.Time).NotEmpty().GreaterThanOrEqualTo(TimeSpan.Zero);
        }
    }
}
