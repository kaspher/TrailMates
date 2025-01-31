using FluentAssertions;
using Microsoft.Extensions.Configuration;
using TrailMates.Domain.Entities.Users;
using TrailMates.Infrastructure.Common.Authentication;

namespace TrailMates.UnitTests.Authentication;

public class TokenProviderTests
{
    [Fact]
    public void Create_ShouldReturnValidToken()
    {
        // Arrange
        var config = new ConfigurationBuilder()
            .AddInMemoryCollection(
                new Dictionary<string, string>
                {
                    { "Jwt:Secret", "12345678912345678912345678900000" }
                }!
            )
            .Build();

        var tokenProvider = new TokenProvider(config);
        var user = new User(
            Guid.NewGuid(),
            "John",
            "Doe",
            "john@gmail.com",
            "Mężczyzna",
            "USA",
            "NY",
            "hashedPassword"
        )
        {
            Roles = [new Role(1, "User")]
        };

        // Act
        var token = tokenProvider.Create(user);

        // Assert
        token.Should().NotBeNullOrEmpty();
    }
}
