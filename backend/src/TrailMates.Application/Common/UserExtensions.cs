using TrailMates.Application.DTO;
using TrailMates.Domain.Entities.Users;

namespace TrailMates.Application.Common;

public static class UserExtensions
{
    public static void Overwrite(this User existingUser, UserDto userDto)
    {
        existingUser.FirstName = userDto.FirstName;
        existingUser.LastName = userDto.LastName;
        existingUser.Gender = userDto.Gender;
        existingUser.Country = userDto.Country;
        existingUser.City = userDto.City;
    }
}
