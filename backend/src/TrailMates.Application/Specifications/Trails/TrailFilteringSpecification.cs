﻿using TrailMates.Domain.Entities.Trails;

namespace TrailMates.Application.Specifications.Trails;

public static class TrailFilteringSpecification
{
    public static IEnumerable<Trail> ApplyFilters(
        this IEnumerable<Trail> trails,
        Guid? userId,
        double? minimumLatitude,
        double? maximumLatitude,
        double? minimumLongitude,
        double? maximumLongitude,
        string[]? trailTypes,
        string? visibility
    )
    {
        if (userId.HasValue)
            trails = trails.Where(x => x.OwnerId == userId);
        if (
            minimumLatitude.HasValue
            || maximumLatitude.HasValue
            || minimumLongitude.HasValue
            || maximumLongitude.HasValue
        )
        {
            trails = trails.Where(trail =>
                trail.Coordinates.Any(coord =>
                    (!minimumLatitude.HasValue || coord.Latitude >= minimumLatitude.Value)
                    && (!maximumLatitude.HasValue || coord.Latitude <= maximumLatitude.Value)
                    && (!minimumLongitude.HasValue || coord.Longitude >= minimumLongitude.Value)
                    && (!maximumLongitude.HasValue || coord.Longitude <= maximumLongitude.Value)
                )
            );
        }

        if (trailTypes is not null && trailTypes.Length != 0)
            trails = trails.Where(trail =>
                trailTypes
                    .Select(type => type.ToLowerInvariant())
                    .Contains(trail.Type.ToLowerInvariant())
            );

        if (visibility is not null)
            trails = trails.Where(trail =>
                string.Equals(trail.Visibility, visibility, StringComparison.OrdinalIgnoreCase)
            );

        return trails;
    }

    public static IEnumerable<TrailCompletion> ApplyFilters(
        this IEnumerable<TrailCompletion> trailsCompletions,
        Guid? userId
    )
    {
        if (userId.HasValue)
            trailsCompletions = trailsCompletions.Where(x => x.UserId == userId);

        return trailsCompletions;
    }
}
