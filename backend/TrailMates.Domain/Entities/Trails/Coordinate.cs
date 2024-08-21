namespace TrailMates.Domain.Entities.Trails;

public class Coordinate(double latitude, double longitude)
{
    public double Latitude { get; } = latitude;
    public double Longitude { get; } = longitude;
}
