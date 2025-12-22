using Domain.Enums;

namespace Application.Dto.UserDto
{
    public class UserSafeReadDto
    {
        public int Id { get; set; }

        public string Username { get; set; } = string.Empty;

        public string? Avatar { get; set; }

        public DateTime RegistrationDate { get; set; }
    }
}
