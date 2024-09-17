using Microsoft.AspNetCore.Routing;

namespace TrailMates.Application.Abstractions;

public interface IEndpoint
{
    static abstract void MapEndpoint(IEndpointRouteBuilder endpoints);
}
