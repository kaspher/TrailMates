using CSharpFunctionalExtensions;
using FluentAssertions;
using Moq;
using TrailMates.Application.Abstractions.Repositories;
using TrailMates.Application.Mappers;
using TrailMates.Domain.Entities.Trails;
using TrailMates.Domain.Entities.Users;
using TrailMates.Domain.Errors;

namespace TrailMates.UnitTests.Mappers;

public class TrailMapperTests
{
    private readonly Mock<IUserRepository> _userRepoMock = new();
    private readonly CancellationToken _cancellationToken = CancellationToken.None;

    [Fact]
    public async Task ToDto_ShouldMapTrailToDto()
    {
        // Arrange
        var trail = new Trail(
            Guid.NewGuid(),
            "Forest Path",
            Guid.NewGuid(),
            "Running",
            TimeSpan.FromHours(3)
        );
        var user = new User(
            trail.OwnerId,
            "Bob",
            "Marley",
            "bob@example.com",
            "Mężczyna",
            "Jamaica",
            "Kingston",
            "password"
        );

        _userRepoMock
            .Setup(repo => repo.GetByIds(It.IsAny<List<Guid>>(), _cancellationToken))
            .ReturnsAsync(Result.Success<List<User>, Error>([user]));

        // Act
        var result = await trail.ToDto(_userRepoMock.Object, _cancellationToken);

        // Assert
        result.Id.Should().Be(trail.Id);
        result.Name.Should().Be(trail.Name);
        result.OwnerId.Should().Be(trail.OwnerId);
        result.OwnerFullName.Should().Be("Bob Marley");
    }
}
