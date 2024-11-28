using System.Collections.Immutable;
using CSharpFunctionalExtensions;
using TrailMates.Application.Abstractions.Repositories;
using TrailMates.Application.DTO;
using TrailMates.Application.Mappers;
using TrailMates.Application.Mediator;
using TrailMates.Domain.Errors;

namespace TrailMates.Application.Features.Events.Queries.GetEvents;

public readonly record struct GetEventsQuery : IQuery<Result<ImmutableList<EventDto>, Error>>;

internal sealed class GetEventsQueryHandler(IEventRepository repository)
    : IQueryHandler<GetEventsQuery, Result<ImmutableList<EventDto>, Error>>
{
    public async Task<Result<ImmutableList<EventDto>, Error>> Handle(
        GetEventsQuery request,
        CancellationToken cancellationToken
    )
    {
        var events = await repository.GetAll(cancellationToken);

        return Result.Success<ImmutableList<EventDto>, Error>(events.Value.ToDto());
    }
}
