using TrailMates.Application.Abstractions;
using TrailMates.Application.DTO;

namespace TrailMates.Application.Features.Trails.Queries.GetTrails;

public class GetTrails : IQuery<IEnumerable<TrailDto>>;