using TrailMates.Domain.Entities.Users;

namespace TrailMates.Application.Abstractions.Authentication;

public interface ITokenProvider
{
    string Create(User user);
}
