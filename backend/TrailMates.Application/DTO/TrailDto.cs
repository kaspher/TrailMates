namespace TrailMates.Application.DTO;

public readonly record struct TrailDto(
    Guid Id,
    string Name,
    Guid OwnerId,
    string OwnerFullName,
    List<CoordinateDto> Coordinates,
    string Type,
    string Visibility
);
