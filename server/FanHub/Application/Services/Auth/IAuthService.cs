using Application.Dto.UserDto;

namespace Application.Services.Auth
{
    public interface IAuthService
    {
        Task<UserAuthResultDto> LoginAsync( string login, string password );
        Task<UserAuthResultDto> RegisterUserAsync( UserCreateDto dto );
        Task<bool> CheckAuthAsync( string token );
    }
}
