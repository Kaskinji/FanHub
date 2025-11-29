using Application.Services.Auth;

namespace Application.Dto.UserDto
{
    public class UserAuthDto
    {
        public int UserId { get; set; }
        public Token Token { get; set; } = null!;
    }
}
