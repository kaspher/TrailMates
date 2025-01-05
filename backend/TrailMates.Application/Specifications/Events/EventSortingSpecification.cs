using TrailMates.Domain.Entities.Events;

namespace TrailMates.Application.Specifications.Events;

public static class EventSortingSpecification
{
    public static IEnumerable<Event> ApplySorting(
        this IEnumerable<Event> events,
        string? sortBy,
        bool sortDescending
    )
    {
        return sortBy?.ToLower() switch
        {
            "name"
                => sortDescending
                    ? events.OrderByDescending(e => e.Name)
                    : events.OrderBy(e => e.Name),
            "startdate"
                => sortDescending
                    ? events.OrderByDescending(e => e.StartDate)
                    : events.OrderBy(e => e.StartDate),
            "enddate"
                => sortDescending
                    ? events.OrderByDescending(e => e.EndDate)
                    : events.OrderBy(e => e.EndDate),
            "participantslimit"
                => sortDescending
                    ? events.OrderByDescending(e => e.ParticipantsLimit)
                    : events.OrderBy(e => e.ParticipantsLimit),
            _ => events.OrderBy(e => e.StartDate)
        };
    }
}
