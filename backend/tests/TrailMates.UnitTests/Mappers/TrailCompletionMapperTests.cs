using CSharpFunctionalExtensions;
using FluentAssertions;
using Moq;
using TrailMates.Application.Abstractions.Repositories;
using TrailMates.Application.Mappers;
using TrailMates.Domain.Entities.Trails;
using TrailMates.Domain.Entities.Users;
using TrailMates.Domain.Errors;

namespace TrailMates.UnitTests.Mappers;

public class TrailCompletionMapperTests
{
    private readonly Mock<IUserRepository> _userRepoMock = new();
    private readonly CancellationToken _cancellationToken = CancellationToken.None;

    [Fact]
    public async Task ToDto_ShouldMapTrailCompletionToDto()
    {
        // Arrange
        var trailCompletion = new TrailCompletion(
            Guid.NewGuid(),
            Guid.NewGuid(),
            Guid.NewGuid(),
            TimeSpan.FromHours(1)
        );
        var user = new User(
            trailCompletion.UserId,
            "Alice",
            "Smith",
            "alice@example.com",
            "Kobieta",
            "Canada",
            "Toronto",
            "password"
        );

        _userRepoMock
            .Setup(repo => repo.GetByIds(It.IsAny<List<Guid>>(), _cancellationToken))
            .ReturnsAsync(Result.Success<List<User>, Error>([user]));

        // Act
        var result = await trailCompletion.ToDto(_userRepoMock.Object, _cancellationToken);

        // Assert
        result.Id.Should().Be(trailCompletion.Id);
        result.TrailId.Should().Be(trailCompletion.TrailId);
        result.UserId.Should().Be(trailCompletion.UserId);
        result.UserFullName.Should().Be("Alice Smith");
    }
}
