using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TrailMates.Domain.Entities.Activities;
using TrailMates.Domain.Entities.Trails;

namespace TrailMates.Infrastructure.Persistence.Activities.Configurations;

internal sealed class ActivityConfiguration : IEntityTypeConfiguration<Activity>
{
    public void Configure(EntityTypeBuilder<Activity> builder)
    {
        builder.ToTable("Activities");
        builder.HasKey(a => a.Id);
        builder.Property(a => a.Title).IsRequired().HasMaxLength(255);
        builder.Property(a => a.Description).HasMaxLength(1000);
        builder.Property(a => a.OwnerId).IsRequired();

        builder
            .HasOne<Trail>()
            .WithMany()
            .HasForeignKey(a => a.TrailId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(a => a.Likes)
            .WithOne()
            .HasForeignKey(l => l.ActivityId)
            .OnDelete(DeleteBehavior.Cascade);

        builder
            .HasMany(a => a.Comments)
            .WithOne()
            .HasForeignKey(c => c.ActivityId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
