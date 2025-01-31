using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using TrailMates.Application.Features.Trails.Commands.UpdateTrail;

namespace TrailMates.Application.Features.Trails.Commands.Contracts;

public record UpdateTrailBody(string? Name, string? Type);

public record UpdateTrailRequest(Guid TrailId, [FromBody] UpdateTrailBody UpdateBody)
{
    public UpdateTrailCommand ToCommand() => new(this);

    public class Validator : AbstractValidator<UpdateTrailRequest>
    {
        public Validator()
        {
            RuleFor(x => x.TrailId).NotEmpty();
        }
    }
}
