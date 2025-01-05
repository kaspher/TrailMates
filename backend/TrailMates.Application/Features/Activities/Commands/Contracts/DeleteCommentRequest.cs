using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using TrailMates.Application.Features.Activities.Commands.DeleteComment;

namespace TrailMates.Application.Features.Activities.Commands.Contracts;

public record DeleteCommentRequest([FromRoute] Guid CommentId)
{
    public DeleteCommentCommand ToCommand() => new(this);

    public class Validator : AbstractValidator<DeleteCommentRequest>
    {
        public Validator()
        {
            RuleFor(x => x.CommentId).NotEmpty();
        }
    }
}
