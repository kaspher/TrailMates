using CSharpFunctionalExtensions;
using Microsoft.EntityFrameworkCore;
using TrailMates.Application.Abstractions.Repositories;
using TrailMates.Domain.Entities.Users;
using TrailMates.Domain.Errors;
using TrailMates.Infrastructure.Common.Persistence;

namespace TrailMates.Infrastructure.Persistence.Users;

internal sealed class RoleRepository(UsersDbContext dbContext) : IRoleRepository
{
    private readonly DbSet<Role> _roles = dbContext.Roles;

    public async Task<Result<Role, Error>> GetByName(
        string name,
        CancellationToken cancellationToken
    )
    {
        var entity = await _roles.FirstOrDefaultAsync(x => x.Name == name, cancellationToken);

        return entity is null
            ? Result.Failure<Role, Error>(
                ErrorsTypes.NotFound($"Role with name {name} is not supported.")
            )
            : Result.Success<Role, Error>(entity);
    }
}
