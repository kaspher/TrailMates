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
    public Guid Id { get; set; } = Id;
    public string FirstName { get; set; } = FirstName;
    public string LastName { get; set; } = LastName;
    public string Email { get; set; } = Email;
    public string Gender { get; set; } = Gender;
    public string Country { get; set; } = Country;
    public string City { get; set; } = City;
    public string Password { get; set; } = Password;

    public List<Role> Roles { get; set; } = [];
}
