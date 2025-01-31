using TrailMates.Application.Features.Trails.Commands.Contracts;
using TrailMates.Domain.Entities.Trails;

namespace TrailMates.Application.Common;

public static class TrailExtensions
{
    public static void Overwrite(this Trail existingTrail, UpdateTrailBody data)
    {
        existingTrail.Name = data.Name ?? existingTrail.Name;
        existingTrail.Type = data.Type ?? existingTrail.Type;
    }
}
