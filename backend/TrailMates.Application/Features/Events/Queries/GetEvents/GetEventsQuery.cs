using CSharpFunctionalExtensions;
using TrailMates.Application.Abstractions.Repositories;
using TrailMates.Application.DTO;
using TrailMates.Application.Mappers;
using TrailMates.Application.Mediator;
using TrailMates.Application.Specifications.Common;
using TrailMates.Domain.Errors;

namespace TrailMates.Application.Features.Events.Queries.GetEvents;

public readonly record struct GetEventsQuery(GetEventsRequest Data)
    : IQuery<Result<PagedList<EventDto>, Error>>;

internal sealed class GetEventsQueryHandler(IEventRepository repository)
    : IQueryHandler<GetEventsQuery, Result<PagedList<EventDto>, Error>>
{
    public async Task<Result<PagedList<EventDto>, Error>> Handle(
        GetEventsQuery request,
        CancellationToken cancellationToken
    )
    {
        var events = await repository.GetAll(request.Data, cancellationToken);

        return Result.Success<PagedList<EventDto>, Error>(events.Value.ToDto());
    }
}
