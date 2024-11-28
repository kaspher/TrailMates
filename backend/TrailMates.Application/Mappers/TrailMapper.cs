using System.Collections.Immutable;
using TrailMates.Application.DTO;
using TrailMates.Domain.Entities.Trails;

namespace TrailMates.Application.Mappers;

public static class TrailMapper
{
    public static TrailDto ToDto(Trail trail) =>
        new(trail.Id.ToString(), trail.Coordinates.Select(ToDto));

    public static ImmutableList<TrailDto> ToDto(this ImmutableList<Trail> trails) =>
        trails.Select(ToDto).ToImmutableList();

    private static CoordinateDto ToDto(Coordinate coordinate) =>
        new(coordinate.Latitude, coordinate.Longitude);
}
