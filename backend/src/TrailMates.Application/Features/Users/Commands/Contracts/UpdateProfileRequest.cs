using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using TrailMates.Application.DTO;
using TrailMates.Application.Features.Users.Commands.UpdateProfile;

namespace TrailMates.Application.Features.Users.Commands.Contracts;

public record UpdateProfileRequest(Guid UserId, [FromBody] UserDto UserDto)
{
    public UpdateProfileCommand ToCommand() => new(UserId, UserDto);

    public class Validator : AbstractValidator<UpdateProfileRequest>
    {
        public Validator()
        {
            RuleFor(x => x.UserId).NotEmpty();
            RuleFor(x => x.UserDto.FirstName).NotEmpty();
            RuleFor(x => x.UserDto.LastName).NotEmpty();
        }
    }
}
