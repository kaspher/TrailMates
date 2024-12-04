using System.Collections.Immutable;
using TrailMates.Application.DTO;
using TrailMates.Application.Specifications.Common;
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

    public static PagedList<EventDto> ToDto(this PagedList<Event> events)
    {
        var eventDtos = events.Items.Select(ToDto).ToList();

        return new PagedList<EventDto>(eventDtos, events.Page, events.PageSize, events.TotalCount);
    }
}
