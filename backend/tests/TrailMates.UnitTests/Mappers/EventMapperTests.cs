using CSharpFunctionalExtensions;
using FluentAssertions;
using Moq;
using TrailMates.Application.Abstractions.Repositories;
using TrailMates.Application.Mappers;
using TrailMates.Application.Specifications.Common;
using TrailMates.Domain.Entities.Events;
using TrailMates.Domain.Entities.Trails;
using TrailMates.Domain.Entities.Users;
using TrailMates.Domain.Errors;

namespace TrailMates.UnitTests.Mappers;

public class EventMapperTests
{
    private readonly Mock<IUserRepository> _userRepoMock = new();
    private readonly Mock<ITrailRepository> _trailRepoMock = new();
    private readonly CancellationToken _cancellationToken = CancellationToken.None;

    [Fact]
    public async Task ToDto_ShouldMapPagedEventsToPagedEventDtos()
    {
        // Arrange
        var organizerId = Guid.NewGuid();
        var trailId = Guid.NewGuid();
        var eventId = Guid.NewGuid();

        var events = new PagedList<Event>(
            [
                new Event(
                    eventId,
                    "Mountain Marathon",
                    "A challenging race",
                    organizerId,
                    trailId,
                    DateTime.Now,
                    DateTime.Now.AddHours(2)
                )
                {
                    Status = EventStatus.Open,
                    ParticipantsIds = [Guid.NewGuid(), Guid.NewGuid()],
                    ParticipantsLimit = 50
                }
            ],
            page: 1,
            pageSize: 10,
            totalCount: 1
        );

        var organizer = new User(
            organizerId,
            "Alice",
            "Brown",
            "alice@example.com",
            "Kobieta",
            "USA",
            "LA",
            "password"
        );
        var trail = new Trail(
            trailId,
            "Rocky Trail",
            Guid.NewGuid(),
            "Running",
            TimeSpan.FromHours(3)
        );

        _userRepoMock
            .Setup(repo => repo.GetByIds(It.IsAny<List<Guid>>(), _cancellationToken))
            .ReturnsAsync(Result.Success<List<User>, Error>([organizer]));

        _trailRepoMock
            .Setup(repo => repo.GetByIds(It.IsAny<List<Guid>>(), _cancellationToken))
            .ReturnsAsync(Result.Success<List<Trail>, Error>([trail]));

        // Act
        var result = await events.ToDto(
            _userRepoMock.Object,
            _trailRepoMock.Object,
            _cancellationToken
        );

        // Assert
        result.Items.Should().HaveCount(1);
        var eventDto = result.Items.First();

        eventDto.Id.Should().Be(eventId);
        eventDto.Name.Should().Be("Mountain Marathon");
        eventDto.Description.Should().Be("A challenging race");
        eventDto.FullName.Should().Be("Alice Brown");
        eventDto.TrailId.Should().Be(trailId);
        eventDto.TrailType.Should().Be("Running");
        eventDto.Status.Should().Be(EventStatus.Open);
        eventDto.ParticipantsIds.Should().HaveCount(2);
        eventDto.ParticipantsLimit.Should().Be(50);
    }

    [Fact]
    public async Task ToDto_ShouldHandleUnknownOrganizerAndTrail()
    {
        // Arrange
        var eventId = Guid.NewGuid();
        var unknownOrganizerId = Guid.NewGuid();
        var unknownTrailId = Guid.NewGuid();

        var events = new PagedList<Event>(
            [
                new Event(
                    eventId,
                    "Unknown Event",
                    "No known details",
                    unknownOrganizerId,
                    unknownTrailId,
                    DateTime.Now,
                    DateTime.Now.AddHours(1)
                )
            ],
            page: 1,
            pageSize: 10,
            totalCount: 1
        );

        _userRepoMock
            .Setup(repo => repo.GetByIds(It.IsAny<List<Guid>>(), _cancellationToken))
            .ReturnsAsync(Result.Success<List<User>, Error>([]));

        _trailRepoMock
            .Setup(repo => repo.GetByIds(It.IsAny<List<Guid>>(), _cancellationToken))
            .ReturnsAsync(Result.Success<List<Trail>, Error>([]));

        // Act
        var result = await events.ToDto(
            _userRepoMock.Object,
            _trailRepoMock.Object,
            _cancellationToken
        );

        // Assert
        result.Items.Should().HaveCount(1);
        var eventDto = result.Items.First();

        eventDto.Id.Should().Be(eventId);
        eventDto.FullName.Should().Be("Unknown Organizer");
        eventDto.TrailType.Should().Be("Unknown trail type");
    }
}
