using Microsoft.AspNetCore.Mvc;

namespace TrailMates.Application.Features.Trails.Queries.GetTrails;

public record GetTrailsRequest(
    [FromQuery] Guid? UserId = null,
    [FromQuery] double? MinimumLatitude = null,
    [FromQuery] double? MaximumLatitude = null,
    [FromQuery] double? MinimumLongitude = null,
    [FromQuery] double? MaximumLongitude = null,
    [FromQuery] string[]? TrailTypes = null,
    [FromQuery] string? Visibility = null
)
{
    public GetTrailsQuery ToQuery() => new(this);
}
