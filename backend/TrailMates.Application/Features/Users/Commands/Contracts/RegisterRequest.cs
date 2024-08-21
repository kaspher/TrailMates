namespace TrailMates.Application.Features.Users.Commands.Contracts;

public readonly record struct RegisterRequest(
    string Email,
    string FirstName,
    string LastName,
    string Gender,
    string Password
);
