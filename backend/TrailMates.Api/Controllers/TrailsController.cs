using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using TrailMates.Application.Abstractions;
using TrailMates.Application.DTO;
using TrailMates.Application.Features.Trails.Queries.GetTrails;

namespace TrailMates.Api.Controllers;

[ApiController]
[Route("trails")]
public class TrailsController(IQueryHandler<GetTrails, IEnumerable<TrailDto>> getTrailsHandler) : ControllerBase
{
    [HttpGet]
    [SwaggerOperation("Get list of all trails")]
    public async Task<ActionResult<IEnumerable<TrailDto>>> GetAll([FromQuery] GetTrails query)
        => Ok(await getTrailsHandler.HandleAsync(query));
}