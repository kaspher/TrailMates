using Microsoft.AspNetCore.Routing;

namespace TrailMates.Application.Common.Interfaces;

public interface IEndpoint
{
    static abstract void MapEndpoint(IEndpointRouteBuilder endpoints);
}
