using CSharpFunctionalExtensions;
using TrailMates.Application.Abstractions.Repositories;
using TrailMates.Application.DTO;
using TrailMates.Application.Mappers;
using TrailMates.Application.Mediator;
using TrailMates.Domain.Errors;

namespace TrailMates.Application.Features.Trails.Queries.GetTrailsCompletions;

public readonly record struct GetTrailsCompletionsQuery(GetTrailsCompletionsRequest Request)
    : IQuery<Result<List<TrailCompletionDto>, Error>>;

internal sealed class GetTrailsQueryHandler(
    ITrailRepository repository,
    IUserRepository userRepository
) : IQueryHandler<GetTrailsCompletionsQuery, Result<List<TrailCompletionDto>, Error>>
{
    public async Task<Result<List<TrailCompletionDto>, Error>> Handle(
        GetTrailsCompletionsQuery query,
        CancellationToken cancellationToken
    )
    {
        var trailsCompletions = await repository.GetAllCompletions(
            query.Request,
            cancellationToken
        );
        var trailsCompletionsDtos = await trailsCompletions.ToDto(
            userRepository,
            cancellationToken
        );

        return Result.Success<List<TrailCompletionDto>, Error>(trailsCompletionsDtos);
    }
}
