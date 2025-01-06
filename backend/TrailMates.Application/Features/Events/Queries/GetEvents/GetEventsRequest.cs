using Microsoft.AspNetCore.Mvc;

namespace TrailMates.Application.Features.Events.Queries.GetEvents;

public record GetEventsRequest(
    [FromQuery] Guid? UserId = null,
    [FromQuery] Guid? TrailId = null,
    [FromQuery] DateTime? StartDateFrom = null,
    [FromQuery] DateTime? StartDateTo = null,
    [FromQuery] int? ParticipantsLimitFrom = null,
    [FromQuery] int? ParticipantsLimitTo = null,
    [FromQuery] string? SortBy = "StartDate",
    [FromQuery] bool SortDescending = false,
    [FromQuery] string[]? Statuses = null,
    [FromQuery] string[]? TrailTypes = null,
    [FromQuery] int Page = 1,
    [FromQuery] int PageSize = 20
)
{
    public GetEventsQuery ToQuery() => new(this);
}
