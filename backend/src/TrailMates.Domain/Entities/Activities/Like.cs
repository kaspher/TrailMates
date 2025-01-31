namespace TrailMates.Domain.Entities.Activities;

public record Like(Guid Id, Guid ActivityId, Guid UserId);
