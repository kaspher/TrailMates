using TrailMates.Application.Abstractions.Repositories;
using TrailMates.Application.DTO;
using TrailMates.Application.Specifications.Common;
using TrailMates.Domain.Entities.Events;

namespace TrailMates.Application.Mappers;

public static class EventMapper
{
    public static async Task<PagedList<EventDto>> ToDto(
        this PagedList<Event> events,
        IUserRepository userRepository,
        CancellationToken cancellationToken
    )
    {
        var organizerIds = events.Items.Select(e => e.OrganizerId).Distinct().ToList();

        var organizerResult = await userRepository.GetByIds(organizerIds, cancellationToken);

        var organizerMap = organizerResult.Value.ToDictionary(
            user => user.Id,
            user => $"{user.FirstName} {user.LastName}"
        );

        var eventDtos = events
            .Items.Select(evnt =>
            {
                var fullName = organizerMap.TryGetValue(evnt.OrganizerId, out var name)
                    ? name
                    : "Unknown Organizer";

                return new EventDto(
                    evnt.Id,
                    evnt.Name,
                    evnt.Description,
                    fullName,
                    evnt.TrailId,
                    evnt.Status,
                    evnt.ParticipantsIds,
                    evnt.StartDate,
                    evnt.EndDate,
                    evnt.ParticipantsLimit
                );
            })
            .ToList();

        return new PagedList<EventDto>(eventDtos, events.Page, events.PageSize, events.TotalCount);
    }
}
