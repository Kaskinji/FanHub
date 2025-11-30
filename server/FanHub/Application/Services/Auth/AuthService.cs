using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Application.Dto.UserDto;
using Application.Options;
using Application.Services.Interfaces;
using Domain.Enums;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Application.Services.Auth
{
    public class AuthService : IAuthService
    {
        private IOptions<JwtOptions> _options;
        private IUserService _userService;
        private ILogger<AuthService> _logger;

        public AuthService( IOptions<JwtOptions> options, IUserService userService, ILogger<AuthService> logger )
        {
            _options = options;
            _userService = userService;
            _logger = logger;
        }

        public async Task<UserAuthDto> RegisterUserAsync( UserCreateDto dto )
        {
            int id = await _userService.Create( dto );

            UserReadDto user = await _userService.GetById( id );
            Token token = GenerateToken( id, user.Role );

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
            Token token = GenerateToken( userId.Value, user.Role );

            return new UserAuthDto()
            {
                UserId = userId.Value,
                Token = token,
            };
        }

        private Token GenerateToken( int userId, UserRole role )
        {
            List<Claim> claims = new List<Claim>()
            {
                new Claim( nameof(userId), userId.ToString() ),
                new Claim( ClaimTypes.Role, role.ToString() )
            };

            SigningCredentials signingCredentials = new SigningCredentials(
               new SymmetricSecurityKey( Encoding.UTF8.GetBytes( _options.Value.Secret ) ), SecurityAlgorithms.HmacSha256 );

            DateTime expireDate = DateTime.UtcNow.AddMinutes( _options.Value.TokenValidityInMinutes );
            JwtSecurityToken token = new JwtSecurityToken(
                signingCredentials: signingCredentials,
                expires: expireDate,
                claims: claims
                );
            string tokenString = new JwtSecurityTokenHandler().WriteToken( token );

            return new Token( tokenString, expireDate );
        }
    }
}