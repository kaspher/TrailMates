using Microsoft.EntityFrameworkCore;
using TrailMates.Domain.Entities.Users;
using TrailMates.Infrastructure.Persistence.Users.Configurations;

namespace TrailMates.Infrastructure.Common.Persistence;

public class UsersDbContext(DbContextOptions<UsersDbContext> options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }
    public DbSet<Role> Roles { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfiguration(new UserConfiguration());
        modelBuilder.ApplyConfiguration(new RoleConfiguration());
        modelBuilder.HasDefaultSchema("users");
    }
}
