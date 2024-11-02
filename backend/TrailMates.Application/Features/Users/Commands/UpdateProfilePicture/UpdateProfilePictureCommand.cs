using CSharpFunctionalExtensions;
using Microsoft.AspNetCore.Http;
using TrailMates.Application.Abstractions;
using TrailMates.Application.Mediator;
using TrailMates.Domain.Errors;

namespace TrailMates.Application.Features.Users.Commands.UpdateProfilePicture;

public readonly record struct UpdateProfilePictureCommand(Guid Id, IFormFile Picture)
    : ICommand<UnitResult<Error>>;

internal sealed class UpdateProfilePictureCommandHandler(IUserRepository userRepository)
    : ICommandHandler<UpdateProfilePictureCommand, UnitResult<Error>>
{
    public async Task<UnitResult<Error>> Handle(
        UpdateProfilePictureCommand command,
        CancellationToken cancellationToken
    )
    {
        var userResult = await userRepository.GetById(command.Id, cancellationToken);
        if (userResult.IsFailure)
            return userResult.ConvertFailure<UnitResult<Error>>();

        await userRepository.UpdateProfilePicture(userResult.Value, command.Picture);
        return UnitResult.Success<Error>();
    }
}
