using System.Collections.Immutable;
using CSharpFunctionalExtensions;
using TrailMates.Application.Features.Events.Queries.GetEvents;
using TrailMates.Application.Specifications.Common;
using TrailMates.Domain.Entities.Events;
using TrailMates.Domain.Errors;

namespace TrailMates.Application.Abstractions.Repositories;

public interface IEventRepository
{
    Task<Result<PagedList<Event>, Error>> GetAll(
        GetEventsRequest request,
        CancellationToken cancellationToken = default
    );
    Task<Result<Event, Error>> GetById(Guid id, CancellationToken cancellationToken = default);
    Task<UnitResult<Error>> AddEvent(Event evnt);
    Task<UnitResult<Error>> JoinEvent(Event evnt, Guid userId);
}
