using CSharpFunctionalExtensions;
using TrailMates.Application.Abstractions.Repositories;
using TrailMates.Application.Features.Activities.Commands.Contracts;
using TrailMates.Application.Mediator;
using TrailMates.Domain.Entities.Activities;
using TrailMates.Domain.Errors;

namespace TrailMates.Application.Features.Activities.Commands.AddComment;

public readonly record struct AddCommentCommand(AddCommentRequest Request)
    : ICommand<UnitResult<Error>>;

internal sealed class AddCommentCommandHandler(
    IActivityRepository activityRepository,
    IUserRepository userRepository
) : ICommandHandler<AddCommentCommand, UnitResult<Error>>
{
    public async Task<UnitResult<Error>> Handle(
        AddCommentCommand command,
        CancellationToken cancellationToken
    )
    {
        var userExistsResult = await userRepository.Exists(command.Request.CommentBody.UserId);
        if (userExistsResult.IsFailure)
            return userExistsResult.ConvertFailure<UnitResult<Error>>();

        await activityRepository.AddComment(
            new Comment(
                Guid.NewGuid(),
                command.Request.ActivityId,
                command.Request.CommentBody.UserId,
                command.Request.CommentBody.Content,
                DateTime.UtcNow
            )
        );

        return UnitResult.Success<Error>();
    }
}
