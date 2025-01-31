using CSharpFunctionalExtensions;
using TrailMates.Application.Abstractions.Authentication;
using TrailMates.Application.Abstractions.Repositories;
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

internal sealed class RegisterCommandHandler(
    IUserRepository userRepository,
    IRoleRepository roleRepository,
    IPasswordHasher passwordHasher
) : ICommandHandler<RegisterCommand, UnitResult<Error>>
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
                ErrorsTypes.BadRequest($"User with email {command.Email} already exists")
            );
        }

        var userRoleResult = await roleRepository.GetByName(RoleConstants.User, cancellationToken);
        if (userRoleResult.IsFailure)
            return userRoleResult.ConvertFailure<UnitResult<Error>>();

        await userRepository.Add(
            new User(
                Id: Guid.NewGuid(),
                FirstName: command.FirstName,
                LastName: command.LastName,
                Email: command.Email,
                Gender: command.Gender,
                Country: "",
                City: "",
                Password: passwordHasher.Hash(command.Password)
            )
            {
                Roles = [userRoleResult.Value]
            }
        );

        return UnitResult.Success<Error>();
    }
}
