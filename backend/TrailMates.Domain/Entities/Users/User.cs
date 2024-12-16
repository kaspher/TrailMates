namespace TrailMates.Domain.Entities.Users;

public record User(
    Guid Id,
    string FirstName,
    string LastName,
    string Email,
    string Gender,
    string Country,
    string City,
    string Password
)
{
    public List<Role> Roles { get; set; } = [];
}
