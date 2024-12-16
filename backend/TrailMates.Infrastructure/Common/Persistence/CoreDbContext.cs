using Microsoft.EntityFrameworkCore;
using TrailMates.Domain.Entities.Activities;
using TrailMates.Domain.Entities.Events;
using TrailMates.Domain.Entities.Trails;

namespace TrailMates.Infrastructure.Common.Persistence;

public class CoreDbContext(DbContextOptions<CoreDbContext> options) : DbContext(options)
{
    public DbSet<Trail> Trails { get; set; }
    public DbSet<Event> Events { get; set; }
    public DbSet<Activity> Activities { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<Like> Likes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyAllCoreConfigurations();
        modelBuilder.HasDefaultSchema("core");
    }
}
