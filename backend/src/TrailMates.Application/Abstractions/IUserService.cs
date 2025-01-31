using CSharpFunctionalExtensions;
using Microsoft.AspNetCore.Http;
using TrailMates.Domain.Errors;

namespace TrailMates.Application.Abstractions;

public interface IUserService
{
    Task<Result<string, Error>> AddOrUpdateUserProfilePicture(string userId, IFormFile picture);
}
