using Domain.Enums;

namespace Domain.Entities;

public class User
{
    public int UserId { get; set; }

    public string Username { get; set; } = string.Empty;

    public string Login { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;

    public string? Avatar { get; set; }

    public DateTime RegistrationDate { get; set; }

    public UserRole Role { get; set; }
}