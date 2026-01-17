using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Application.Options;
using Application.Services.Auth;
using Domain.Enums;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Infrastructure.Auth
{
    public class JwtTokenGenerator : ITokenGenerator
    {
        IOptions<JwtOptions> _options;

        public JwtTokenGenerator( IOptions<JwtOptions> options )
        {
            _options = options;
        }

        public Token GenerateToken( int userId, UserRole role )
        {
            List<Claim> claims = new List<Claim>()
            {
                new Claim( ClaimTypes.NameIdentifier, userId.ToString() ),
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
