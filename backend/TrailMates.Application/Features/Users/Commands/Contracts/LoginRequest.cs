namespace TrailMates.Application.Features.Users.Commands.Contracts;

public readonly record struct LoginRequest(string Email, string Password);
