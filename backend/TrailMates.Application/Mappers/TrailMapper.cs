using TrailMates.Application.DTO;
using TrailMates.Domain.Entities.Trails;

namespace TrailMates.Application.Mappers;

public static class TrailMapper
{
    public static TrailDto ToDto(Trail entity) =>
        new(entity.Id.ToString(), entity.Coordinates.Select(ToDto));

    private static CoordinateDto ToDto(Coordinate entity) => new(entity.Latitude, entity.Longitude);
}
