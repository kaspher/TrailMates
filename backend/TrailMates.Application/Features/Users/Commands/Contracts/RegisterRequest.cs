using FluentValidation;
using TrailMates.Application.Features.Users.Commands.Register;

namespace TrailMates.Application.Features.Users.Commands.Contracts;

public record RegisterRequest(
    string Email,
    string FirstName,
    string LastName,
    string Gender,
    string Password
)
{
    public RegisterCommand ToCommand() => new(Email, FirstName, LastName, Gender, Password);

    public class Validator : AbstractValidator<RegisterRequest>
    {
        public Validator()
        {
            RuleFor(x => x.Email).NotEmpty().EmailAddress();
            RuleFor(x => x.FirstName).NotEmpty();
            RuleFor(x => x.LastName).NotEmpty();
            RuleFor(x => x.Gender).NotEmpty();
            RuleFor(x => x.Password).NotEmpty();
        }
    }
}
