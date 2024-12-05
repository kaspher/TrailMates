using CSharpFunctionalExtensions;
using Microsoft.AspNetCore.Http;
using TrailMates.Domain.Entities.Users;
using TrailMates.Domain.Errors;

namespace TrailMates.Application.Abstractions.Repositories;

public interface IUserRepository
{
    Task<Result<User, Error>> GetById(Guid ids, CancellationToken cancellationToken = default);
    Task<Result<List<User>, Error>> GetByIds(
        List<Guid> id,
        CancellationToken cancellationToken = default
    );
    Task<UnitResult<Error>> Exists(string email);
    Task<Result<string, Error>> Login(string email, string password);
    Task Add(User user);
    Task UpdateProfile(User user);
    Task UpdateProfilePicture(User user, IFormFile picture);
}
