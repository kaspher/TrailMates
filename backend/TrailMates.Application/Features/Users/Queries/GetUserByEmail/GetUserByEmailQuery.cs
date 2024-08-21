using CSharpFunctionalExtensions;
using TrailMates.Application.Common.Interfaces;
using TrailMates.Application.DTO;
using TrailMates.Application.Mediator;
using TrailMates.Domain.Entities.Users;
using TrailMates.Domain.Errors;

namespace TrailMates.Application.Features.Users.Queries.GetUserByEmail;

public readonly record struct GetUserByEmailQuery(string Email) : IQuery<Result<UserDto, Error>>;

internal sealed class GetUserByEmailQueryHandler(IUserRepository repository)
    : IQueryHandler<GetUserByEmailQuery, Result<UserDto, Error>>
{
    public async Task<Result<UserDto, Error>> Handle(
        GetUserByEmailQuery request,
        CancellationToken cancellationToken
    ) => await repository.GetByEmail(request.Email, cancellationToken).Map(ToDto);

    private static UserDto ToDto(User user) =>
        new(user.Id, user.Email, user.FirstName, user.LastName);
}
