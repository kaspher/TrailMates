namespace TrailMates.Domain.Entities.Users;

public record Role(int Id, string Name)
{
    public List<User> Users { get; set; } = [];
}

public static class RoleConstants
{
    public const string Admin = "Admin";
    public const string User = "User";
    public const string Moderator = "Moderator";
}
