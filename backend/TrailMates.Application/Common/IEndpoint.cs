using Microsoft.AspNetCore.Routing;

namespace TrailMates.Application.Common;

public interface IEndpoint
{
    static abstract void MapEndpoint(IEndpointRouteBuilder endpoints);
}