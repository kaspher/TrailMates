using CSharpFunctionalExtensions;
using FluentAssertions;
using Moq;
using TrailMates.Application.Abstractions;
using TrailMates.Application.Abstractions.Repositories;
using TrailMates.Application.Mappers;
using TrailMates.Domain.Entities.Activities;
using TrailMates.Domain.Entities.Users;
using TrailMates.Domain.Errors;

namespace TrailMates.UnitTests.Mappers;

public class ActivityMapperTests
{
    private readonly Mock<IUserRepository> _userRepoMock = new();
    private readonly Mock<IActivityService> _activityServiceMock = new();
    private readonly CancellationToken _cancellationToken = CancellationToken.None;

    [Fact]
    public async Task ToDto_ShouldMapActivityToDto()
    {
        // Arrange
        var activity = new Activity(
            Guid.NewGuid(),
            "Hiking",
            "A fun hike",
            Guid.NewGuid(),
            Guid.NewGuid(),
            Guid.NewGuid()
        );
        var user = new User(
            activity.OwnerId,
            "John",
            "Doe",
            "john@example.com",
            "Mężczyzna",
            "USA",
            "NY",
            "password"
        );

        _userRepoMock
            .Setup(repo => repo.GetById(activity.OwnerId, _cancellationToken))
            .ReturnsAsync(Result.Success<User, Error>(user));

        _activityServiceMock
            .Setup(service => service.ListAllObjectsFromFolder(activity.Id.ToString()))
            .ReturnsAsync(["image1.jpg", "image2.jpg"]);

        // Act
        var result = await activity.ToDto(
            _userRepoMock.Object,
            _activityServiceMock.Object,
            _cancellationToken
        );

        // Assert
        result.Title.Should().Be(activity.Title);
        result.Description.Should().Be(activity.Description);
        result.OwnerId.Should().Be(activity.OwnerId);
        result.PicturesNames.Should().HaveCount(2);
        result.OwnerFullName.Should().Be("John Doe");
    }
}
