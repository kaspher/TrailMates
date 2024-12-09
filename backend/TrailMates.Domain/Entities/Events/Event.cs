namespace TrailMates.Domain.Entities.Events;

public class Event(
    Guid id,
    string name,
    string description,
    Guid organizerId,
    Guid trailId,
    DateTime startDate,
    DateTime endDate,
    int participantsLimit = int.MaxValue
)
{
    public Guid Id { get; init; } = id;
    public string Name { get; init; } = name;
    public string Description { get; init; } = description;
    public Guid OrganizerId { get; init; } = organizerId;
    public Guid TrailId { get; init; } = trailId;
    public int ParticipantsLimit { get; init; } = participantsLimit;
    public string Status { get; init; } = EventStatus.Open;
    public List<Guid> ParticipantsIds { get; init; } = [];
    public DateTime StartDate { get; init; } = startDate;
    public DateTime EndDate { get; init; } = endDate;
    public DateTime CreatedAt { get; init; } = DateTime.Now;
}

public static class EventStatus
{
    public const string Open = "Open";
    public const string Active = "Active";
    public const string Cancelled = "Cancelled";
    public const string Completed = "Completed";
}
