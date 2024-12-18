namespace TrailMates.Domain.Entities.Activities;

public record Comment(Guid Id, Guid ActivityId, Guid UserId, string Content, DateTime CreatedAt);
