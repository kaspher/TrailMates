using CSharpFunctionalExtensions;
using TrailMates.Application.Abstractions.Repositories;
using TrailMates.Application.Features.Activities.Commands.Contracts;
using TrailMates.Application.Mediator;
using TrailMates.Domain.Errors;

namespace TrailMates.Application.Features.Activities.Commands.DeleteComment;

public readonly record struct DeleteCommentCommand(DeleteCommentRequest Request)
    : ICommand<UnitResult<Error>>;

internal sealed class DeleteCommentCommandHandler(IActivityRepository activityRepository)
    : ICommandHandler<DeleteCommentCommand, UnitResult<Error>>
{
    public async Task<UnitResult<Error>> Handle(
        DeleteCommentCommand command,
        CancellationToken cancellationToken
    )
    {
        var request = command.Request;

        var commentExistsResult = await activityRepository.CommentExists(request.CommentId);
        if (commentExistsResult.IsFailure)
            return commentExistsResult.ConvertFailure<UnitResult<Error>>();

        await activityRepository.DeleteComment(request.CommentId);
        return UnitResult.Success<Error>();
    }
}
