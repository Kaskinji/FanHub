using Domain.Enums;

namespace Domain.Entities;

public class User : Entity
{
    public string Username { get; set; } = string.Empty;

    public string Login { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public string? Avatar { get; set; }

    public DateTime RegistrationDate { get; set; }

    public UserRole Role { get; set; }
}