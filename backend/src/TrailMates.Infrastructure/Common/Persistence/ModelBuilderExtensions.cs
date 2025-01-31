using TrailMates.Infrastructure.Persistence.Activities.Configurations;
using TrailMates.Infrastructure.Persistence.Events;
using TrailMates.Infrastructure.Persistence.Trails.Configurations;

namespace TrailMates.Infrastructure.Common.Persistence;

using Microsoft.EntityFrameworkCore;

public static class ModelBuilderExtensions
{
    public static void ApplyAllCoreConfigurations(this ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfiguration(new TrailConfiguration());
        modelBuilder.ApplyConfiguration(new EventConfiguration());
        modelBuilder.ApplyConfiguration(new ActivityConfiguration());
        modelBuilder.ApplyConfiguration(new LikeConfiguration());
        modelBuilder.ApplyConfiguration(new CommentConfiguration());

        modelBuilder.HasDefaultSchema("core");
    }
}
