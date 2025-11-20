using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Application.Dto.UserDto;
using Application.Options;
using Application.Services.Interfaces;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Application.Services.Auth
{
    public class AuthService : IAuthService
    {
        private IOptions<JwtOptions> _options;
        private IUserService _userService;

        public AuthService( IOptions<JwtOptions> options, IUserService userService )
        {
            _options = options;
            _userService = userService;
        }

        public async Task<UserAuthDto> RegisterUserAsync( UserCreateDto dto )
        {
            int id = await _userService.Create( dto );

            Token token = GenerateToken( id );

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
                throw new UnauthorizedAccessException( "Invalid credentials" );
            }

            Token token = GenerateToken( userId.Value );

            return new UserAuthDto()
            {
                UserId = userId.Value,
                Token = token,
            };
        }

        private Token GenerateToken( int userId )
        {
            List<Claim> claims = new List<Claim>()
            {
                new Claim( nameof(userId), userId.ToString())
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

        private bool VerifyToken( string token )
        {
            string[] parts = token.Split( ".".ToCharArray() );
            string header = parts[ 0 ];
            string payload = parts[ 1 ];
            string signature = parts[ 2 ];

            byte[] bytesToSign = Encoding.UTF8.GetBytes( string.Join( ".", header, payload ) );
            byte[] bytesToSecret = Encoding.UTF8.GetBytes( _options.Value.Secret );

            HMACSHA256 alg = new HMACSHA256( bytesToSecret );
            byte[] hash = alg.ComputeHash( bytesToSign );

            string computedSignature = Base64UrlEncoder.Encode( hash );

            return signature == computedSignature;
        }
    }
}
