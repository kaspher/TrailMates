using CSharpFunctionalExtensions;
using TrailMates.Application.Common.Interfaces;
using TrailMates.Application.Mediator;
using TrailMates.Domain.Errors;

namespace TrailMates.Application.Features.Users.Commands.Login;

public readonly record struct LoginCommand(string Email, string Password)
    : ICommand<Result<string, Error>>;

internal sealed class LoginCommandHandler(IUserRepository userRepository)
    : ICommandHandler<LoginCommand, Result<string, Error>>
{
    public async Task<Result<string, Error>> Handle(
        LoginCommand command,
        CancellationToken cancellationToken
    )
    {
        var loginResult = await userRepository.Login(command.Email, command.Password);
        return loginResult.IsFailure
            ? Result.Failure<string, Error>(loginResult.Error)
            : loginResult.Value;
    }
}
