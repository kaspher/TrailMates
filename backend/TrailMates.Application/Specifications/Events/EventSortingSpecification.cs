using TrailMates.Domain.Entities.Events;

namespace TrailMates.Application.Specifications.Events;

public static class EventSortingSpecification
{
    public static IQueryable<Event> ApplySorting(
        this IQueryable<Event> query,
        string? sortBy,
        bool sortDescending
    )
    {
        return sortBy?.ToLower() switch
        {
            "name"
                => sortDescending
                    ? query.OrderByDescending(e => e.Name)
                    : query.OrderBy(e => e.Name),
            "startdate"
                => sortDescending
                    ? query.OrderByDescending(e => e.StartDate)
                    : query.OrderBy(e => e.StartDate),
            "enddate"
                => sortDescending
                    ? query.OrderByDescending(e => e.EndDate)
                    : query.OrderBy(e => e.EndDate),
            "participantslimit"
                => sortDescending
                    ? query.OrderByDescending(e => e.ParticipantsLimit)
                    : query.OrderBy(e => e.ParticipantsLimit),
            _ => query.OrderBy(e => e.StartDate)
        };
    }
}
