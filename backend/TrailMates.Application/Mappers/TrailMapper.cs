using TrailMates.Application.DTO;
using TrailMates.Core.Entities;

namespace TrailMates.Application.Mappers;

public static class TrailMapper
{
    public static TrailDto ToDto(Trail entity) =>
        new(entity.Id.Value.ToString(), entity.Coordinates.Select(ToDto));

    private static CoordinateDto ToDto(Coordinate entity) => new(entity.Latitude, entity.Longitude);
}
