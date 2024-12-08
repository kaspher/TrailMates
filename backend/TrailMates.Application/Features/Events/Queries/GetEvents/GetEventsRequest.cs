using Microsoft.AspNetCore.Mvc;

namespace TrailMates.Application.Features.Events.Queries.GetEvents;

public record GetEventsRequest(
    [FromQuery] DateTime? StartDateFrom = null,
    [FromQuery] DateTime? StartDateTo = null,
    [FromQuery] int? ParticipantsLimitFrom = null,
    [FromQuery] int? ParticipantsLimitTo = null,
    [FromQuery] string? SortBy = "StartDate",
    [FromQuery] bool SortDescending = false,
    [FromQuery] int Page = 1,
    [FromQuery] int PageSize = 20
)
{
    public GetEventsQuery ToQuery() => new(this);
}
