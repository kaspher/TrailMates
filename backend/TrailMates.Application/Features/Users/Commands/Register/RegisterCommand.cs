using CSharpFunctionalExtensions;
using TrailMates.Application.Common.Interfaces;
using TrailMates.Application.Mediator;
using TrailMates.Domain.Entities.Users;
using TrailMates.Domain.Errors;

namespace TrailMates.Application.Features.Users.Commands.Register;

public readonly record struct RegisterCommand(
    string Email,
    string FirstName,
    string LastName,
    string Gender,
    string Password
) : ICommand<UnitResult<Error>>;

internal sealed class RegisterCommandHandler(IUserRepository userRepository)
    : ICommandHandler<RegisterCommand, UnitResult<Error>>
{
    public async Task<UnitResult<Error>> Handle(
        RegisterCommand command,
        CancellationToken cancellationToken
    )
    {
        var existsResult = await userRepository.Exists(command.Email);
        if (existsResult.IsSuccess)
        {
            return UnitResult.Failure(
                Errors.BadRequest($"User with email {command.Email} already exists")
            );
        }

        await userRepository.Add(
            new User(
                Guid.NewGuid(),
                command.FirstName,
                command.LastName,
                command.Email,
                command.Gender,
                command.Password,
                ["guest"]
            )
        );

        return UnitResult.Success<Error>();
    }
}
