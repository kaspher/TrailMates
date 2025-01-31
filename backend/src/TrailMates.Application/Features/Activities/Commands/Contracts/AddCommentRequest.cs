using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using TrailMates.Application.Features.Activities.Commands.AddComment;

namespace TrailMates.Application.Features.Activities.Commands.Contracts;

public record CommentBody(Guid UserId, string Content);

public record AddCommentRequest([FromRoute] Guid ActivityId, [FromBody] CommentBody CommentBody)
{
    public AddCommentCommand ToCommand() => new(this);

    public class Validator : AbstractValidator<AddCommentRequest>
    {
        public Validator()
        {
            RuleFor(x => x.ActivityId).NotEmpty();
            RuleFor(x => x.CommentBody.UserId).NotEmpty();
            RuleFor(x => x.CommentBody.Content).NotEmpty().MinimumLength(1);
        }
    }
}
