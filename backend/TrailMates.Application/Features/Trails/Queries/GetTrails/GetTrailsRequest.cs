using Microsoft.AspNetCore.Mvc;
using TrailMates.Domain.Entities.Trails;

namespace TrailMates.Application.Features.Trails.Queries.GetTrails;

public record GetTrailsRequest(
    [FromQuery] double? MinimumLatitude = null,
    [FromQuery] double? MaximumLatitude = null,
    [FromQuery] double? MinimumLongitude = null,
    [FromQuery] double? MaximumLongitude = null,
    [FromQuery] string[]? TrailTypes = null,
    [FromQuery] string? Visibility = VisibilityType.Public
)
{
    public GetTrailsQuery ToQuery() => new(this);
}
