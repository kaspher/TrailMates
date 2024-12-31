using TrailMates.Application.Abstractions.Repositories;
using TrailMates.Application.DTO;
using TrailMates.Domain.Entities.Trails;

namespace TrailMates.Application.Mappers;

public static class TrailMapper
{
    public static async Task<List<TrailDto>> ToDto(
        this List<Trail> trails,
        IUserRepository userRepository,
        CancellationToken cancellationToken
    )
    {
        var ownerIds = trails.Select(trail => trail.OwnerId).Distinct().ToList();

        var ownerResult = await userRepository.GetByIds(ownerIds, cancellationToken);

        var ownerMap = ownerResult.Value.ToDictionary(
            user => user.Id,
            user => $"{user.FirstName} {user.LastName}"
        );

        var trailDtos = trails
            .Select(trail =>
            {
                var ownerFullName = ownerMap.TryGetValue(trail.OwnerId, out var name)
                    ? name
                    : "Unknown Owner";

                return new TrailDto(
                    trail.Id,
                    trail.Name,
                    trail.OwnerId,
                    ownerFullName,
                    trail.Coordinates.Select(ToDto).ToList(),
                    trail.Type,
                    trail.Visibility
                );
            })
            .ToList();

        return trailDtos;
    }

    private static CoordinateDto ToDto(Coordinate coordinate) =>
        new(coordinate.Latitude, coordinate.Longitude, coordinate.Order);
}
