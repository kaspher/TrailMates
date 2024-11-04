using TrailMates.Application.DTO;
using TrailMates.Domain.Entities.Users;

namespace TrailMates.Application.Common;

public static class UserExtensions
{
    public static User Map(this UserDto userDto, User existingUser) =>
        existingUser with
        {
            FirstName = userDto.FirstName,
            LastName = userDto.LastName,
            Gender = userDto.Gender,
            Country = userDto.Country,
            City = userDto.City
        };
}
