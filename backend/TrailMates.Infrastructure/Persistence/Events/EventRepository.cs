﻿using CSharpFunctionalExtensions;
using Microsoft.EntityFrameworkCore;
using TrailMates.Application.Abstractions.Repositories;
using TrailMates.Application.Features.Events.Queries.GetEvents;
using TrailMates.Application.Specifications.Common;
using TrailMates.Application.Specifications.Events;
using TrailMates.Domain.Entities.Events;
using TrailMates.Domain.Errors;
using TrailMates.Infrastructure.Common.Persistence;

namespace TrailMates.Infrastructure.Persistence.Events;

internal sealed class EventRepository(EventsDbContext dbContext) : IEventRepository
{
    private readonly DbSet<Event> _events = dbContext.Events;

    public async Task<Result<PagedList<Event>, Error>> GetAll(
        GetEventsRequest request,
        CancellationToken cancellationToken = default
    )
    {
        var eventsQuery = _events
            .AsNoTracking()
            .ApplyFilters(
                request.StartDateFrom,
                request.StartDateTo,
                request.ParticipantsLimitFrom,
                request.ParticipantsLimitTo
            )
            .ApplySorting(request.SortBy, request.SortDescending);

        var events = await PagedList<Event>.CreateAsync(
            eventsQuery,
            request.Page,
            request.PageSize
        );

        return Result.Success<PagedList<Event>, Error>(events);
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

    public async Task<UnitResult<Error>> LeaveEvent(Event evnt, Guid userId)
    {
        evnt.ParticipantsIds.Remove(userId);

        _events.Update(evnt);
        await dbContext.SaveChangesAsync();

        return UnitResult.Success<Error>();
    }
}
