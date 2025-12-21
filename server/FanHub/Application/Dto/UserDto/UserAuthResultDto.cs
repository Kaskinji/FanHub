using Application.Services.Auth;

namespace Application.Dto.UserDto
{
    public class UserAuthResultDto
    {
        public int UserId { get; set; }
        public Token Token { get; set; } = null!;
    }
}
