using TrailMates.Domain.Entities.Events;

namespace TrailMates.Application.Specifications.Events;

public static class EventFilteringSpecification
{
    public static IQueryable<Event> ApplyFilters(
        this IQueryable<Event> query,
        DateTime? startDateFrom,
        DateTime? startDateTo,
        int? participantsLimitFrom,
        int? participantsLimitTo
    )
    {
        if (startDateFrom.HasValue)
            query = query.Where(e => e.StartDate >= startDateFrom.Value);

        if (startDateTo.HasValue)
            query = query.Where(e => e.StartDate <= startDateTo.Value);

        if (participantsLimitFrom.HasValue)
            query = query.Where(e => e.ParticipantsLimit >= participantsLimitFrom.Value);

        if (participantsLimitTo.HasValue)
            query = query.Where(e => e.ParticipantsLimit <= participantsLimitTo.Value);

        return query;
    }
}
