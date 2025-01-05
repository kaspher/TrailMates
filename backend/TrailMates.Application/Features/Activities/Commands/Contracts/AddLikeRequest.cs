using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using TrailMates.Application.Features.Activities.Commands.AddLike;

namespace TrailMates.Application.Features.Activities.Commands.Contracts;

public record AddLikeRequest([FromRoute] Guid ActivityId, [FromBody] Guid UserId)
{
    public AddLikeCommand ToCommand() => new(this);

    public class Validator : AbstractValidator<AddLikeRequest>
    {
        public Validator()
        {
            RuleFor(x => x.ActivityId).NotEmpty();
            RuleFor(x => x.UserId).NotEmpty();
        }
    }
}
