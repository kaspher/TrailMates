using CSharpFunctionalExtensions;
using TrailMates.Application.Abstractions.Repositories;
using TrailMates.Application.DTO;
using TrailMates.Application.Mediator;
using TrailMates.Domain.Entities.Users;
using TrailMates.Domain.Errors;

namespace TrailMates.Application.Features.Users.Queries.GetUser;

public readonly record struct GetUserQuery(Guid UserId) : IQuery<Result<UserDto, Error>>;

internal sealed class GetUserQueryHandler(IUserRepository repository)
    : IQueryHandler<GetUserQuery, Result<UserDto, Error>>
{
    public async Task<Result<UserDto, Error>> Handle(
        GetUserQuery request,
        CancellationToken cancellationToken
    ) => await repository.GetById(request.UserId, cancellationToken).Map(ToDto);

    private static UserDto ToDto(User user) =>
        new(
            user.FirstName,
            user.LastName,
            user.Email,
            user.Gender,
            user.Country,
            user.City,
            user.Roles.Select(r => r.Name).ToList()
        );
}
