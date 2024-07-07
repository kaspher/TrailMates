using TrailMates.Application.DTO;
using TrailMates.Application.Mediator;

namespace TrailMates.Application.Features.Trails.Queries.GetTrail;

public class GetTrail : IQuery<TrailDto>
{
    public Guid TrailId { get; set; }
}