using FluentAssertions;
using TrailMates.Domain.Entities.Events;
using TrailMates.Domain.Services.Validators;

namespace TrailMates.UnitTests.Validators;

public class EventValidatorTests
{
    [Fact]
    public void ValidateJoinEvent_ShouldReturnError_WhenEventIsNotOpen()
    {
        // Arrange
        var evnt = new Event(
            Guid.NewGuid(),
            "Marathon",
            "City marathon",
            Guid.NewGuid(),
            Guid.NewGuid(),
            DateTime.Now,
            DateTime.Now.AddHours(2)
        )
        {
            Status = EventStatus.Cancelled
        };
        var userId = Guid.NewGuid();

        // Act
        var result = EventValidator.ValidateJoinEvent(evnt, userId);

        // Assert
        result.IsFailure.Should().BeTrue();
        result.Error.Reason.Message.Should().Be("Event is not open to registration.");
    }

    [Fact]
    public void ValidateJoinEvent_ShouldReturnSuccess_WhenUserCanJoin()
    {
        // Arrange
        var evnt = new Event(
            Guid.NewGuid(),
            "Trail Run",
            "10km Trail Run",
            Guid.NewGuid(),
            Guid.NewGuid(),
            DateTime.Now,
            DateTime.Now.AddHours(2)
        )
        {
            Status = EventStatus.Open
        };
        var userId = Guid.NewGuid();

        // Act
        var result = EventValidator.ValidateJoinEvent(evnt, userId);

        // Assert
        result.IsSuccess.Should().BeTrue();
    }
}
