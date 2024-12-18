namespace TrailMates.Domain.Entities.Activities;

public class Activity(Guid id, string title, string description, Guid ownerId, Guid trailId)
{
    public Guid Id { get; init; } = id;
    public string Title { get; init; } = title;
    public string Description { get; init; } = description;
    public Guid OwnerId { get; init; } = ownerId;
    public Guid TrailId { get; init; } = trailId;
    public List<Like> Likes { get; set; } = [];
    public List<Comment> Comments { get; set; } = [];
    public DateTime CreatedAt { get; set; } = DateTime.Now;
}
