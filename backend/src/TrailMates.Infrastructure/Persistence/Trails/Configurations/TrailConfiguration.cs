using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
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

        var trailCompletionConverter = new ValueConverter<List<TrailCompletion>, string>(
            completions =>
                JsonSerializer.Serialize(
                    completions,
                    new JsonSerializerOptions { WriteIndented = false }
                ),
            json =>
                string.IsNullOrEmpty(json)
                    ? new List<TrailCompletion>()
                    : JsonSerializer.Deserialize<List<TrailCompletion>>(
                        json,
                        new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
                    ) ?? new List<TrailCompletion>()
        );

        var trailCompletionComparer = new ValueComparer<List<TrailCompletion>>(
            (c1, c2) =>
                c1 == null && c2 == null || c1 != null && c2 != null && c1.SequenceEqual(c2),
            c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())), // Handle null in hash code
            c => c.ToList()
        );

        builder
            .Property(x => x.TrailCompletions)
            .HasColumnType("jsonb")
            .IsRequired()
            .HasConversion(trailCompletionConverter)
            .Metadata.SetValueComparer(trailCompletionComparer);
    }
}
