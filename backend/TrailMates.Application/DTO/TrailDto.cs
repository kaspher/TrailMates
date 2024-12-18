namespace TrailMates.Application.DTO;

public readonly record struct TrailDto(
    Guid Id,
    string Name,
    List<CoordinateDto> Coordinates,
    string Visibility
);
