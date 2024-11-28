using System.Collections.Immutable;
using CSharpFunctionalExtensions;
using Microsoft.EntityFrameworkCore;
using TrailMates.Application.Abstractions.Repositories;
using TrailMates.Domain.Entities.Events;
using TrailMates.Domain.Errors;
using TrailMates.Infrastructure.Common.Persistence;

namespace TrailMates.Infrastructure.Persistence.Events;

internal sealed class EventRepository(EventsDbContext dbContext) : IEventRepository
{
    private readonly DbSet<Event> _events = dbContext.Events;

    public async Task<Result<ImmutableList<Event>, Error>> GetAll(
        CancellationToken cancellationToken = default
    )
    {
        var events = await _events
            .AsNoTracking()
            .OrderBy(e => e.StartDate)
            .ToListAsync(cancellationToken);

        return Result.Success<ImmutableList<Event>, Error>(events.ToImmutableList());
    }

    public async Task<Result<Event, Error>> GetById(
        Guid id,
        CancellationToken cancellationToken = default
    )
    {
        var entity = await _events
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == id, cancellationToken);

        return entity is null
            ? Result.Failure<Event, Error>(
                ErrorsTypes.NotFound($"Event with id {id} was not found")
            )
            : Result.Success<Event, Error>(entity);
    }

    public async Task<UnitResult<Error>> AddEvent(Event evnt)
    {
        var exists = await _events.AnyAsync(e =>
            e.OrganizerId == evnt.OrganizerId
            && (e.Status == EventStatus.Open || e.Status == EventStatus.Active)
            && e.StartDate < evnt.EndDate
            && e.EndDate > evnt.StartDate
        );

        if (exists)
            return UnitResult.Failure(
                ErrorsTypes.BadRequest(
                    $"User with id {evnt.OrganizerId} already hosts one event at that time."
                )
            );

        await _events.AddAsync(evnt);
        await dbContext.SaveChangesAsync();
        return UnitResult.Success<Error>();
    }

    public async Task<UnitResult<Error>> JoinEvent(Event evnt, Guid userId)
    {
        evnt.ParticipantsIds.Add(userId);

        _events.Update(evnt);
        await dbContext.SaveChangesAsync();

        return UnitResult.Success<Error>();
    }
}
