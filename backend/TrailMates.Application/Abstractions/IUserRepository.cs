using CSharpFunctionalExtensions;
using TrailMates.Domain.Entities.Users;
using TrailMates.Domain.Errors;

namespace TrailMates.Application.Abstractions;

public interface IUserRepository
{
    Task<Result<User, Error>> GetByEmail(
        string email,
        CancellationToken cancellationToken = default
    );
    Task<UnitResult<Error>> Exists(string email);
    Task<Result<string, Error>> Login(string email, string password);
    Task Add(User user);
    Task Update(User user);
    Task Delete(User user);
}
