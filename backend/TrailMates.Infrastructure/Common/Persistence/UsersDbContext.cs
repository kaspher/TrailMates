using Microsoft.EntityFrameworkCore;
using TrailMates.Domain.Entities.Users;

namespace TrailMates.Infrastructure.Common.Persistence;

public class UsersDbContext(DbContextOptions options) : DbContext(options)
{
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.HasDefaultSchema("users");
    }
}
