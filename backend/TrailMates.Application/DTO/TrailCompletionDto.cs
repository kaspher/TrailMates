namespace TrailMates.Application.DTO;

public record TrailCompletionDto(Guid TrailId, Guid UserId, string UserFullName, TimeSpan Time);
