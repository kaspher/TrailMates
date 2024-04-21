using TrailMates.Application.DTO;
using TrailMates.Core.Entities;

namespace TrailMates.Infrastructure.DAL.Handlers;

public static class Extensions
{
    public static TrailDto AsDto(this Trail entity)
        => new()
        {
            Id = entity.Id.Value.ToString(),
            Coordinates = entity.Coordinates.Select(x => new CoordinateDto()
            {
                Latitude = x.Latitude,
                Longitude = x.Longitude
            })
        };
}