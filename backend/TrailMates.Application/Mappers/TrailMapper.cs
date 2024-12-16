using TrailMates.Application.DTO;
using TrailMates.Domain.Entities.Trails;

namespace TrailMates.Application.Mappers;

public static class TrailMapper
{
    public static List<TrailDto> ToDto(this IEnumerable<Trail> trails) =>
        trails.Select(ToDto).ToList();

    private static TrailDto ToDto(Trail trail) =>
        new(trail.Id, trail.Name, trail.Coordinates.Select(ToDto).ToList(), trail.Visibility);

    private static CoordinateDto ToDto(Coordinate coordinate) =>
        new(coordinate.Latitude, coordinate.Longitude, coordinate.Order);
}
