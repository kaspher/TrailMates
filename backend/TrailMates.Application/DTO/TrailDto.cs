namespace TrailMates.Application.DTO;

public readonly record struct TrailDto(string Id, IEnumerable<CoordinateDto> Coordinates);
