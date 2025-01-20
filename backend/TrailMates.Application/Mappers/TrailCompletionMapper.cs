using TrailMates.Application.Abstractions.Repositories;
using TrailMates.Application.DTO;
using TrailMates.Domain.Entities.Trails;

namespace TrailMates.Application.Mappers;

public static class TrailCompletionMapper
{
    public static async Task<List<TrailCompletionDto>> ToDto(
        this List<TrailCompletion> trailCompletions,
        IUserRepository userRepository,
        CancellationToken cancellationToken
    )
    {
        var userIds = trailCompletions.Select(tc => tc.UserId).Distinct().ToList();

        var userMap = await GetUserMap(userRepository, userIds, cancellationToken);

        return trailCompletions.Select(tc => CreateTrailCompletionDto(tc, userMap)).ToList();
    }

    public static async Task<TrailCompletionDto> ToDto(
        this TrailCompletion trailCompletion,
        IUserRepository userRepository,
        CancellationToken cancellationToken
    )
    {
        var userMap = await GetUserMap(userRepository, [trailCompletion.UserId], cancellationToken);

        return CreateTrailCompletionDto(trailCompletion, userMap);
    }

    public static TrailCompletionDto CreateTrailCompletionDto(
        TrailCompletion trailCompletion,
        IDictionary<Guid, string> userMap
    )
    {
        var userFullName = userMap.TryGetValue(trailCompletion.UserId, out var name)
            ? name
            : "Unknown User";

        return new TrailCompletionDto(
            trailCompletion.TrailId,
            trailCompletion.UserId,
            userFullName,
            trailCompletion.Time
        );
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
}
