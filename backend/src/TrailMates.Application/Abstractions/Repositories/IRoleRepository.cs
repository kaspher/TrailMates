using CSharpFunctionalExtensions;
using TrailMates.Domain.Entities.Users;
using TrailMates.Domain.Errors;

namespace TrailMates.Application.Abstractions.Repositories;

public interface IRoleRepository
{
    public Task<Result<Role, Error>> GetByName(string name, CancellationToken cancellationToken);
}
