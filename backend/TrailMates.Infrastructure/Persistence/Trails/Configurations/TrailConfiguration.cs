using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TrailMates.Domain.Entities.Trails;

namespace TrailMates.Infrastructure.Persistence.Trails.Configurations;

internal sealed class TrailConfiguration : IEntityTypeConfiguration<Trail>
{
    public void Configure(EntityTypeBuilder<Trail> builder)
    {
        builder.ToTable("Trails", "core");

        builder.HasKey(x => x.Id);
        builder.Property(x => x.Name).IsRequired().HasMaxLength(50);
        builder.Property(x => x.OwnerId).IsRequired();
        builder.Property(x => x.Coordinates).HasColumnType("jsonb").IsRequired();
        builder.Property(x => x.Type).IsRequired();
    }
}
