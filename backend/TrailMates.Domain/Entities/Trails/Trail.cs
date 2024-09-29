namespace TrailMates.Domain.Entities.Trails;

public class Trail(Guid id, IEnumerable<Coordinate> coordinates)
{
    public Guid Id { get; private set; } = id;
    public IEnumerable<Coordinate> Coordinates { get; private set; } = coordinates;
}
