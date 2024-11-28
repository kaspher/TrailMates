using TrailMates.Domain.Entities.Events;

namespace TrailMates.Application.DTO;

public record EventDto(
    Guid Id,
    string Name,
    string Description,
    Guid OrganizerId,
    Guid TrailId,
    string Status,
    List<Guid> ParticipantsIds,
    DateTime StartDate,
    DateTime EndDate,
    int ParticipantsLimit
);
