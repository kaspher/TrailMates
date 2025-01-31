namespace TrailMates.Application.DTO;

public readonly record struct TrailDto(
    Guid Id,
    string Name,
    Guid OwnerId,
    string OwnerFullName,
    List<CoordinateDto> Coordinates,
    List<TrailCompletionDto> TrailCompletions,
    string Type,
    TimeSpan Time,
    string Visibility
);
