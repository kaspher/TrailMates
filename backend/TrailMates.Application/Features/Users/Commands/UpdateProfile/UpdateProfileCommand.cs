using CSharpFunctionalExtensions;
using TrailMates.Application.Abstractions;
using TrailMates.Application.Abstractions.Repositories;
using TrailMates.Application.DTO;
using TrailMates.Application.Mediator;
using TrailMates.Domain.Errors;
using static TrailMates.Application.Common.UserExtensions;

namespace TrailMates.Application.Features.Users.Commands.UpdateProfile;

public readonly record struct UpdateProfileCommand(Guid Id, UserDto UserDto)
    : ICommand<UnitResult<Error>>;

internal sealed class UpdateProfileCommandHandler(IUserRepository userRepository)
    : ICommandHandler<UpdateProfileCommand, UnitResult<Error>>
{
    public async Task<UnitResult<Error>> Handle(
        UpdateProfileCommand command,
        CancellationToken cancellationToken
    )
    {
        var userResult = await userRepository.GetById(command.Id, cancellationToken);
        if (userResult.IsFailure)
            return userResult.ConvertFailure<UnitResult<Error>>();

        await userRepository.UpdateProfile(command.UserDto.Map(userResult.Value));
        return UnitResult.Success<Error>();
    }
}
