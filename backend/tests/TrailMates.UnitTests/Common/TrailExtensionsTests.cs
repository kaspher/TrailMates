using FluentAssertions;
using TrailMates.Application.Common;
using TrailMates.Application.Features.Trails.Commands.Contracts;
using TrailMates.Domain.Entities.Trails;

namespace TrailMates.UnitTests.Common;

public class TrailExtensionsTests
{
    [Fact]
    public void Overwrite_ShouldUpdateTrailProperties()
    {
        // Arrange
        var trail = new Trail(
            Guid.NewGuid(),
            "Old Trail",
            Guid.NewGuid(),
            "Cycling",
            TimeSpan.FromHours(2)
        );
        var update = new UpdateTrailBody("New Trail", "Running");

        // Act
        trail.Overwrite(update);

        // Assert
        trail.Name.Should().Be(update.Name);
        trail.Type.Should().Be(update.Type);
    }
}
