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

internal sealed class GetEventsQueryHandler(
    IEventRepository eventRepository,
    IUserRepository userRepository,
    ITrailRepository trailRepository
) : IQueryHandler<GetEventsQuery, Result<PagedList<EventDto>, Error>>
{
    public async Task<Result<PagedList<EventDto>, Error>> Handle(
        GetEventsQuery request,
        CancellationToken cancellationToken
    )
    {
        var events = await eventRepository.GetAll(request.Data, cancellationToken);

        var eventsDtos = await events.Value.ToDto(
            userRepository,
            trailRepository,
            cancellationToken
        );

        return Result.Success<PagedList<EventDto>, Error>(eventsDtos);
    }
}
