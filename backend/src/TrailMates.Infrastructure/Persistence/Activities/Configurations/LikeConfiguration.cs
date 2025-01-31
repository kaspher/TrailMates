using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TrailMates.Domain.Entities.Activities;

namespace TrailMates.Infrastructure.Persistence.Activities.Configurations;

internal sealed class LikeConfiguration : IEntityTypeConfiguration<Like>
{
    public void Configure(EntityTypeBuilder<Like> builder)
    {
        builder.ToTable("Likes");
        builder.HasKey(l => l.Id);

        builder.HasIndex(l => new { l.ActivityId, l.UserId }).IsUnique();

        builder.Property(l => l.UserId).IsRequired();

        builder
            .HasOne<Activity>()
            .WithMany(a => a.Likes)
            .HasForeignKey(l => l.ActivityId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
