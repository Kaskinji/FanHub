using Domain.Enums;

namespace Application.Dto.UserDto
{
    public class UserCreateDto
    {
        public string Username { get; set; } = string.Empty;

        public string Login { get; set; } = string.Empty;

        public string Password { get; set; } = string.Empty;

        public string? Avatar { get; set; }
    }
}
