using TrailMates.Application.Abstractions;
using TrailMates.Application.DTO;

namespace TrailMates.Application.Queries;

public class GetTrail : IQuery<TrailDto>
{
    public Guid TrailId { get; set; }
}