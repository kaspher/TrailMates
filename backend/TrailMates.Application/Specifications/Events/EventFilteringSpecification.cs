using TrailMates.Application.Abstractions.Repositories;
using TrailMates.Domain.Entities.Events;

namespace TrailMates.Application.Specifications.Events;

public static class EventFilteringSpecification
{
    public static async Task<IEnumerable<Event>> ApplyFilters(
        this IEnumerable<Event> events,
        ITrailRepository trailRepository,
        Guid? userId,
        Guid? trailId,
        DateTime? startDateFrom,
        DateTime? startDateTo,
        int? participantsLimitFrom,
        int? participantsLimitTo,
        string[]? statuses,
        string[]? trailTypes
    )
    {
        if (userId.HasValue)
            events = events.Where(e => e.OrganizerId == userId);

        if (trailId.HasValue)
            events = events.Where(e => e.TrailId == trailId);

        if (startDateFrom.HasValue)
            events = events.Where(e => e.StartDate >= startDateFrom.Value);

        if (startDateTo.HasValue)
            events = events.Where(e => e.StartDate <= startDateTo.Value);

        if (participantsLimitFrom.HasValue)
            events = events.Where(e => e.ParticipantsLimit >= participantsLimitFrom.Value);

        if (participantsLimitTo.HasValue)
            events = events.Where(e => e.ParticipantsLimit <= participantsLimitTo.Value);

        if (statuses is not null && statuses.Length != 0)
            events = events.Where(evnt =>
                statuses
                    .Select(status => status.ToLowerInvariant())
                    .Contains(evnt.Status.ToLowerInvariant())
            );

        if (trailTypes is null || trailTypes.Length == 0)
            return events;

        events = events.ToList();
        var trailIds = events.Select(e => e.TrailId).Distinct().ToList();
        var trails = await trailRepository.GetByIds(trailIds);

        var trailMap = trails.Value.ToDictionary(
            trail => trail.Id,
            trail => trail.Type.ToLowerInvariant()
        );

        events = events.Where(evnt =>
            trailMap.TryGetValue(evnt.TrailId, out var trailType)
            && trailTypes.Select(t => t.ToLowerInvariant()).Contains(trailType)
        );

        return events;
    }
}
