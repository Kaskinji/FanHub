using Application.Dto.UserDto;
using Application.Services.Interfaces;
using Microsoft.Extensions.Logging;

namespace Application.Services.Auth
{
    public class AuthService : IAuthService
    {
        private IUserService _userService;
        private ILogger<AuthService> _logger;
        private ITokenGenerator _tokenGenerator;
        private ITokenValidator _tokenValidator;

        public AuthService( ITokenGenerator generator, IUserService userService, ILogger<AuthService> logger, ITokenValidator tokenValidator )
        {
            _userService = userService;
            _tokenGenerator = generator;
            _logger = logger;
            _tokenValidator = tokenValidator;
        }

        public async Task<UserAuthDto> RegisterUserAsync( UserCreateDto dto )
        {
            int id = await _userService.Create( dto );

            UserReadDto user = await _userService.GetById( id );
            Token token = _tokenGenerator.GenerateToken( id, user.Role );

            return new UserAuthDto()
            {
                UserId = id,
                Token = token,
            };
        }

        public async Task<UserAuthDto> LoginAsync( string login, string password )
        {
            int? userId = await _userService.GetUserIdByCredentialsAsync( login, password );
            if ( userId is null )
            {
                _logger.LogWarning( "Invalid Credentials." );
                throw new UnauthorizedAccessException( "Invalid credentials" );
            }

            UserReadDto user = await _userService.GetById( userId.Value );
            Token token = _tokenGenerator.GenerateToken( userId.Value, user.Role );

            return new UserAuthDto()
            {
                UserId = userId.Value,
                Token = token,
            };
        }

        public async Task<bool> CheckAuthAsync( string token )
        {
            return await _tokenValidator.ValidateTokenAsync( token );
        }
    }
}