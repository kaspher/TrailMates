using TrailMates.Application.Abstractions;
using TrailMates.Application.DTO;

namespace TrailMates.Application.Features.Trails.Queries.GetTrail;

public class GetTrail : IQuery<TrailDto>
{
    public Guid TrailId { get; set; }
}