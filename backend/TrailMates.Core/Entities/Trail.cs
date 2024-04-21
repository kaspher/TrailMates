using TrailMates.Core.ValueObjects;

namespace TrailMates.Core.Entities;

public class Trail(TrailId id, IEnumerable<Coordinate> coordinates)
{
    public TrailId Id { get; private set; } = id;
    public IEnumerable<Coordinate> Coordinates { get; private set; } = coordinates;

    public static Trail Create(TrailId id, IEnumerable<Coordinate> coordinates)
        => new(id, coordinates);
}

