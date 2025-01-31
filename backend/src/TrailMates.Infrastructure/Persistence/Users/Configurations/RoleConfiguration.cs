using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TrailMates.Domain.Entities.Users;

namespace TrailMates.Infrastructure.Persistence.Users.Configurations;

internal sealed class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder.ToTable("Roles");
        builder.HasKey(r => r.Id);
        builder.Property(r => r.Name).IsRequired().HasMaxLength(100);

        builder.HasData(
            new Role(1, RoleConstants.Admin),
            new Role(2, RoleConstants.User),
            new Role(3, RoleConstants.Moderator)
        );
    }
}
