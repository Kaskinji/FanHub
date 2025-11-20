namespace Application.Dto.UserDto
{
    public class UserReadDto
    {
        public int Id { get; set; }

        public string Username { get; set; } = string.Empty;

        public string Login { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;

        public string? Avatar { get; set; }

        public DateTime RegistrationDate { get; set; }
    }
}
