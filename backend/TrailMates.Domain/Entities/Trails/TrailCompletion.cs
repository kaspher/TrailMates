namespace TrailMates.Domain.Entities.Trails;

public record TrailCompletion(Guid Id, Guid TrailId, Guid UserId, TimeSpan Time);
