using TrailMates.Domain.Entities.Users;

namespace TrailMates.Application.DTO;

public readonly record struct UserDto(
    string FirstName,
    string LastName,
    string Email,
    string Gender,
    string Country,
    string City,
    List<string> Roles
);
