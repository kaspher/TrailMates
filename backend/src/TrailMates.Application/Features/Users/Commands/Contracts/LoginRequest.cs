using FluentValidation;
using TrailMates.Application.Features.Users.Commands.Login;

namespace TrailMates.Application.Features.Users.Commands.Contracts;

public record LoginRequest(string Email, string Password)
{
    public LoginCommand ToCommand() => new(Email, Password);

    public class Validator : AbstractValidator<LoginRequest>
    {
        public Validator()
        {
            RuleFor(x => x.Email).NotEmpty();
            RuleFor(x => x.Password).NotEmpty();
        }
    }
}
