using Microsoft.EntityFrameworkCore;
using TrailMates.Domain.Entities.Events;
using TrailMates.Infrastructure.Persistence.Events;

namespace TrailMates.Infrastructure.Common.Persistence;

public class EventsDbContext(DbContextOptions<EventsDbContext> options) : DbContext(options)
{
    public DbSet<Event> Events { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfiguration(new EventConfiguration());
        modelBuilder.HasDefaultSchema("events");
    }
}
