using Domain.Enums;

namespace Application.Dto.UserDto
{
    public class UserCreateDto
    {
        public string Username { get; set; } = string.Empty;

        public string Login { get; set; } = string.Empty;

        public string PasswordHash { get; set; } = string.Empty;

        public string? Avatar { get; set; }

        public DateTime RegistrationDate { get; set; }

        public UserRole Role { get; set; }
    }
}
