namespace TrailMates.Core.Entities;

public class Coordinate(double latitude, double longitude)
{
    public double Latitude { get; } = latitude;
    public double Longitude { get; } = longitude;
}
