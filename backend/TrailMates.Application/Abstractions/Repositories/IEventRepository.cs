using System.Collections.Immutable;
using CSharpFunctionalExtensions;
using TrailMates.Domain.Entities.Events;
using TrailMates.Domain.Errors;

namespace TrailMates.Application.Abstractions.Repositories;

public interface IEventRepository
{
    Task<Result<ImmutableList<Event>, Error>> GetAll(CancellationToken cancellationToken = default);
    Task<Result<Event, Error>> GetById(Guid id, CancellationToken cancellationToken = default);
    Task<UnitResult<Error>> AddEvent(Event evnt);
    Task<UnitResult<Error>> JoinEvent(Event evnt, Guid userId);
}
