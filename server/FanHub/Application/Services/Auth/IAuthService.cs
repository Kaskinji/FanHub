using Application.Dto.UserDto;

namespace Application.Services.Auth
{
    public interface IAuthService
    {
        Task<UserAuthDto> LoginAsync( string login, string password );
        Task<UserAuthDto> RegisterUserAsync( UserCreateDto dto );
    }
}
