using CSharpFunctionalExtensions;
using TrailMates.Application.Abstractions.Repositories;
using TrailMates.Application.DTO;
using TrailMates.Application.Mappers;
using TrailMates.Application.Mediator;
using TrailMates.Domain.Errors;
using Result = CSharpFunctionalExtensions.Result;

namespace TrailMates.Application.Features.Trails.Queries.GetTrails;

public readonly record struct GetTrailsQuery(GetTrailsRequest Request)
    : IQuery<Result<List<TrailDto>, Error>>;

internal sealed class GetTrailsQueryHandler(
    ITrailRepository repository,
    IUserRepository userRepository
) : IQueryHandler<GetTrailsQuery, Result<List<TrailDto>, Error>>
{
    public async Task<Result<List<TrailDto>, Error>> Handle(
        GetTrailsQuery query,
        CancellationToken cancellationToken
    )
    {
        var trails = await repository.GetAll(query.Request, cancellationToken);
        var trailsDtos = await trails.ToDto(userRepository, cancellationToken);

        return Result.Success<List<TrailDto>, Error>(trailsDtos);
    }
}
