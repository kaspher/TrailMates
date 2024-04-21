namespace TrailMates.Application.DTO;

public class TrailDto
{
    public string Id { get; set; }
    public IEnumerable<CoordinateDto> Coordinates { get; set; }
}