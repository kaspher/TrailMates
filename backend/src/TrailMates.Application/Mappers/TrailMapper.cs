using TrailMates.Application.Abstractions.Repositories;
using TrailMates.Application.DTO;
using TrailMates.Domain.Entities.Trails;
using static TrailMates.Application.Mappers.TrailCompletionMapper;

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
        var completionUserIds = trails
            .SelectMany(trail => trail.TrailCompletions.Select(tc => tc.UserId))
            .Distinct()
            .ToList();

        var ownerMap = await GetUserMap(userRepository, ownerIds, cancellationToken);
        var completionUserMap = await GetUserMap(
            userRepository,
            completionUserIds,
            cancellationToken
        );

        return trails.Select(trail => CreateTrailDto(trail, ownerMap, completionUserMap)).ToList();
    }

    public static async Task<TrailDto> ToDto(
        this Trail trail,
        IUserRepository userRepository,
        CancellationToken cancellationToken
    )
    {
        var ownerMap = await GetUserMap(userRepository, [trail.OwnerId], cancellationToken);
        var completionUserMap = await GetUserMap(
            userRepository,
            trail.TrailCompletions.Select(tc => tc.UserId).Distinct().ToList(),
            cancellationToken
        );

        return CreateTrailDto(trail, ownerMap, completionUserMap);
    }

    private static async Task<Dictionary<Guid, string>> GetUserMap(
        IUserRepository userRepository,
        List<Guid> userIds,
        CancellationToken cancellationToken
    )
    {
        var userResult = await userRepository.GetByIds(userIds, cancellationToken);

        return userResult.Value.ToDictionary(
            user => user.Id,
            user => $"{user.FirstName} {user.LastName}"
        );
    }

    private static TrailDto CreateTrailDto(
        Trail trail,
        IDictionary<Guid, string> ownerMap,
        IDictionary<Guid, string> completionUserMap
    )
    {
        var ownerFullName = ownerMap.TryGetValue(trail.OwnerId, out var ownerName)
            ? ownerName
            : "Unknown Owner";

        var trailCompletionDtos = trail
            .TrailCompletions.Select(tc => CreateTrailCompletionDto(tc, completionUserMap))
            .ToList();

        return new TrailDto(
            trail.Id,
            trail.Name,
            trail.OwnerId,
            ownerFullName,
            trail.Coordinates.Select(ToDto).ToList(),
            trailCompletionDtos,
            trail.Type,
            trail.Time,
            trail.Visibility
        );
    }

    private static CoordinateDto ToDto(Coordinate coordinate) =>
        new(coordinate.Latitude, coordinate.Longitude, coordinate.Order);
}
