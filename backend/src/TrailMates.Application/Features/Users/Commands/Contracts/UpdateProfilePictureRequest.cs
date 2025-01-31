using FluentValidation;
using Microsoft.AspNetCore.Http;
using TrailMates.Application.Features.Users.Commands.UpdateProfilePicture;

namespace TrailMates.Application.Features.Users.Commands.Contracts;

public record UpdateProfilePictureRequest(Guid UserId, IFormFile Picture)
{
    public UpdateProfilePictureCommand ToCommand() => new(UserId, Picture);

    public class Validator : AbstractValidator<UpdateProfilePictureRequest>
    {
        private const int PictureMaxSize = 2 * 1024 * 1024; // 2MB

        public Validator()
        {
            RuleFor(x => x.UserId).NotEmpty();
            RuleFor(x => x.Picture)
                .NotEmpty()
                .Must(picture =>
                    picture
                        is { ContentType: "image/jpeg" or "image/png", Length: <= PictureMaxSize }
                );
        }
    }
}
