namespace TrailMates.Application.DTO;

public record TrailCompletionDto(
    Guid Id,
    Guid TrailId,
    Guid UserId,
    string UserFullName,
    TimeSpan Time
);
