using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Application.Options;
using Application.Services.Auth;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace Infrastructure.Auth
{
    public class JwtTokenValidator : ITokenValidator
    {
        IOptions<JwtOptions> _options;

        public JwtTokenValidator( IOptions<JwtOptions> options )
        {
            _options = options;
        }

        public async Task<bool> ValidateTokenAsync( string token )
        {
            JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
            byte[] key = Encoding.UTF8.GetBytes( _options.Value.Secret );

            TokenValidationResult validationResult = await tokenHandler.ValidateTokenAsync( token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey( key ),
                ValidateIssuer = false,
                ValidateAudience = false,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            } );

            return validationResult.IsValid;
        }
    }
}
