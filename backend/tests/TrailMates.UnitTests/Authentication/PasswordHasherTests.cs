using FluentAssertions;
using TrailMates.Infrastructure.Common.Authentication;

namespace TrailMates.UnitTests.Authentication;

public class PasswordHasherTests
{
    private readonly PasswordHasher _hasher = new();

    [Fact]
    public void Hash_ShouldReturnNonEmptyString()
    {
        // Act
        var result = _hasher.Hash("password123");

        // Assert
        result.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public void Verify_ShouldReturnTrue_WhenPasswordIsCorrect()
    {
        // Arrange
        const string password = "securePassword";
        var hash = _hasher.Hash(password);

        // Act
        var result = _hasher.Verify(password, hash);

        // Assert
        result.Should().BeTrue();
    }

    [Fact]
    public void Verify_ShouldReturnFalse_WhenPasswordIsIncorrect()
    {
        // Arrange
        const string password = "securePassword";
        var hash = _hasher.Hash(password);

        // Act
        var result = _hasher.Verify("wrongPassword", hash);

        // Assert
        result.Should().BeFalse();
    }
}
