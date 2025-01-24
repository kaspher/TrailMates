namespace TrailMates.Domain.Entities.Trails;

public record Trail(
    Guid Id,
    string Name,
    Guid OwnerId,
    string Type,
    TimeSpan Time,
    string Visibility = VisibilityType.Private
)
{
    public Guid Id { get; set; } = Id;
    public string Name { get; set; } = Name;
    public Guid OwnerId { get; set; } = OwnerId;
    public string Type { get; set; } = Type;
    public TimeSpan Time { get; set; } = Time;
    public string Visibility { get; set; } = Visibility;
    public List<Coordinate> Coordinates { get; set; } = [];
    public List<TrailCompletion> TrailCompletions { get; set; } = [];
}

public record Coordinate(double Latitude, double Longitude, int Order);

public abstract class VisibilityType
{
    public const string Private = "Private";
    public const string Public = "Public";
}
