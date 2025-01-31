using CSharpFunctionalExtensions;
using TrailMates.Application.Abstractions.Repositories;
using TrailMates.Application.DTO;
using TrailMates.Application.Mediator;
using TrailMates.Domain.Errors;
using static TrailMates.Application.Mappers.TrailMapper;

namespace TrailMates.Application.Features.Trails.Queries.GetTrail;

public readonly record struct GetTrailQuery(Guid UserId) : IQuery<Result<TrailDto, Error>>;

internal sealed class GetTrailQueryHandler(
    ITrailRepository repository,
    IUserRepository userRepository
) : IQueryHandler<GetTrailQuery, Result<TrailDto, Error>>
{
    public async Task<Result<TrailDto, Error>> Handle(
        GetTrailQuery request,
        CancellationToken cancellationToken
    ) =>
        await repository
            .GetById(request.UserId, cancellationToken)
            .Map(t => t.ToDto(userRepository, cancellationToken));
}
