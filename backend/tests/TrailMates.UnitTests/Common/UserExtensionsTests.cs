using FluentAssertions;
using TrailMates.Application.Common;
using TrailMates.Application.DTO;
using TrailMates.Domain.Entities.Users;

namespace TrailMates.UnitTests.Common;

public class UserExtensionsTests
{
    [Fact]
    public void Overwrite_ShouldUpdateUserProperties()
    {
        // Arrange
        var user = new User(
            Guid.NewGuid(),
            "Old",
            "Name",
            "email@gmail.com",
            "Mężczyzna",
            "OldCountry",
            "OldCity",
            "Password123"
        );
        var dto = new UserDto(
            "NewFirst",
            "NewLast",
            "test@mail.com",
            "F",
            "NewCountry",
            "NewCity",
            []
        );

        // Act
        user.Overwrite(dto);

        // Assert
        user.FirstName.Should().Be(dto.FirstName);
        user.LastName.Should().Be(dto.LastName);
        user.Gender.Should().Be(dto.Gender);
        user.Country.Should().Be(dto.Country);
        user.City.Should().Be(dto.City);
    }
}
