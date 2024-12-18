using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TrailMates.Domain.Entities.Events;
using TrailMates.Domain.Entities.Trails;

namespace TrailMates.Infrastructure.Persistence.Events;

internal sealed class EventConfiguration : IEntityTypeConfiguration<Event>
{
    public void Configure(EntityTypeBuilder<Event> builder)
    {
        builder.ToTable("Events", "core");
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Name).IsRequired().HasMaxLength(50);
        builder.Property(x => x.Description).IsRequired().HasMaxLength(500);
        builder.Property(x => x.OrganizerId).IsRequired();
        builder.Property(x => x.ParticipantsLimit).IsRequired();

        builder
            .HasOne<Trail>()
            .WithMany()
            .HasForeignKey(a => a.TrailId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
