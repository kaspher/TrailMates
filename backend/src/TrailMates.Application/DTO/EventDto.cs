namespace TrailMates.Application.DTO;

public record EventDto(
    Guid Id,
    string Name,
    string Description,
    string FullName,
    Guid TrailId,
    string TrailType,
    string Status,
    List<Guid> ParticipantsIds,
    DateTime StartDate,
    DateTime EndDate,
    int ParticipantsLimit
);
