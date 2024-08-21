namespace TrailMates.Application.DTO;

public readonly record struct UserDto(Guid Id, string Email, string FirstName, string LastName);
