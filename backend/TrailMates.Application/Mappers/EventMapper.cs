using System.Collections.Immutable;
using TrailMates.Application.DTO;
using TrailMates.Domain.Entities.Events;

namespace TrailMates.Application.Mappers;

public static class EventMapper
{
    public static EventDto ToDto(Event evnt) =>
        new(
            evnt.Id,
            evnt.Name,
            evnt.Description,
            evnt.OrganizerId,
            evnt.TrailId,
            evnt.Status,
            evnt.ParticipantsIds,
            evnt.StartDate,
            evnt.EndDate,
            evnt.ParticipantsLimit
        );

    public static ImmutableList<EventDto> ToDto(this ImmutableList<Event> events) =>
        events.Select(ToDto).ToImmutableList();
}
