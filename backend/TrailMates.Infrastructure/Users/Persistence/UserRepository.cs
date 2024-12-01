﻿using CSharpFunctionalExtensions;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using TrailMates.Application.Abstractions;
using TrailMates.Application.Abstractions.Authentication;
using TrailMates.Domain.Entities.Users;
using TrailMates.Domain.Errors;
using TrailMates.Infrastructure.Common.Persistence;

namespace TrailMates.Infrastructure.Users.Persistence;

internal sealed class UserRepository(
    UsersDbContext dbContext,
    IUserService userService,
    ITokenProvider tokenProvider,
    IPasswordHasher passwordHasher
) : IUserRepository
{
    private readonly DbSet<User> _users = dbContext.Users;

    public async Task<Result<User, Error>> GetById(
        Guid id,
        CancellationToken cancellationToken = default
    )
    {
        var entity = await _users
            .AsNoTracking()
            .SingleOrDefaultAsync(x => x.Id == id, cancellationToken);

        return entity is null
            ? Result.Failure<User, Error>(Errors.NotFound($"User with id {id} was not found"))
            : Result.Success<User, Error>(entity);
    }

    public async Task<UnitResult<Error>> Exists(string email)
    {
        var exists = await _users.AnyAsync(x => x.Email == email);

        return exists
            ? UnitResult.Success<Error>()
            : UnitResult.Failure(Errors.NotFound($"User with email {email} was not found"));
    }

    public async Task<Result<string, Error>> Login(string email, string password)
    {
        var user = await _users.FirstOrDefaultAsync(x => x.Email == email);

        if (user is null)
            return Result.Failure<string, Error>(
                Errors.NotFound("User with provided credentials not found.")
            );

        var verified = passwordHasher.Verify(password, user.Password);

        return !verified
            ? Result.Failure<string, Error>(Errors.BadRequest("Wrong email or password."))
            : tokenProvider.Create(user);
    }

    public async Task Add(User user)
    {
        await _users.AddAsync(user);
        await dbContext.SaveChangesAsync();
    }

    public async Task UpdateProfile(User user)
    {
        dbContext.Update(user);
        await dbContext.SaveChangesAsync();
    }

    public async Task UpdateProfilePicture(User user, IFormFile picture) =>
        await userService.AddOrUpdateUserProfilePicture(user.Id.ToString(), picture);
}