namespace TrailMates.Application.DTO;

public class CoordinateDto(double latitude, double longitude)
{
    public double Latitude { get; set; } = latitude;
    public double Longitude { get; set; } = longitude;
}
