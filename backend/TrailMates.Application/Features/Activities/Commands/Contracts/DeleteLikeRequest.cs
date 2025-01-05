using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using TrailMates.Application.Features.Activities.Commands.DeleteLike;

namespace TrailMates.Application.Features.Activities.Commands.Contracts;

public record DeleteLikeRequest([FromRoute] Guid LikeId)
{
    public DeleteLikeCommand ToCommand() => new(this);

    public class Validator : AbstractValidator<DeleteLikeRequest>
    {
        public Validator()
        {
            RuleFor(x => x.LikeId).NotEmpty();
        }
    }
}
