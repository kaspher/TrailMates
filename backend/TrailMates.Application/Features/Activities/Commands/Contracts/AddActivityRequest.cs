using FluentValidation;
using Microsoft.AspNetCore.Http;
using TrailMates.Application.Features.Activities.Commands.AddActivity;
using Microsoft.AspNetCore.Mvc;

namespace TrailMates.Application.Features.Activities.Commands.Contracts;

public record AddActivityRequest(
    string Title,
    string Description,
    Guid OwnerId,
    Guid TrailId,
    [FromForm(Name = "pictures")] List<IFormFile> Pictures
)
{
    public AddActivityCommand ToCommand() => new(this);

    public class Validator : AbstractValidator<AddActivityRequest>
    {
        public Validator()
        {
            RuleFor(x => x.Title).NotEmpty();
            RuleFor(x => x.Description).NotEmpty().MinimumLength(20);
            RuleFor(x => x.OwnerId).NotEmpty();
            RuleFor(x => x.TrailId).NotEmpty();
            RuleFor(x => x.Pictures)
                .NotNull()
                .Must(pictures => pictures.All(IsValidImageFile))
                .WithMessage("All files must be valid image files (jpg, jpeg, png)");
        }

        private static bool IsValidImageFile(IFormFile file)
        {
            if (file.Length == 0)
                return false;

            var allowedExtensions = new[] { ".jpg", ".jpeg", ".png" };
            var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
            return allowedExtensions.Contains(extension);
        }
    }
}
