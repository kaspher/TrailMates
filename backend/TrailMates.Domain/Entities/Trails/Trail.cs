namespace TrailMates.Domain.Entities.Trails;

public record Trail(Guid Id, string Name, Guid OwnerId, string Visibility = VisibilityType.Private)
{
    public List<Coordinate> Coordinates { get; set; } = [];
}

public record Coordinate(double Latitude, double Longitude, int Order);

public abstract class VisibilityType
{
    public const string Private = "Private";
    public const string Public = "Public";
}
