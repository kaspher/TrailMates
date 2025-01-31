using Microsoft.AspNetCore.Mvc;

namespace TrailMates.Application.Features.Trails.Queries.GetTrailsCompletions;

public record GetTrailsCompletionsRequest([FromQuery] Guid? UserId = null)
{
    public GetTrailsCompletionsQuery ToQuery() => new(this);
}
