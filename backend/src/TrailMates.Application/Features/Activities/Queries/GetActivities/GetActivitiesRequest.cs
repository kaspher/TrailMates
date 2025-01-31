using Microsoft.AspNetCore.Mvc;

namespace TrailMates.Application.Features.Activities.Queries.GetActivities;

public record GetActivitiesRequest([FromQuery] int Page = 1, [FromQuery] int PageSize = 20)
{
    public GetActivitiesQuery ToQuery() => new(this);
}
