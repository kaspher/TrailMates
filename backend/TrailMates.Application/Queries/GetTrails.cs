using TrailMates.Application.Abstractions;
using TrailMates.Application.DTO;

namespace TrailMates.Application.Queries;

public class GetTrails : IQuery<IEnumerable<TrailDto>>
{
}