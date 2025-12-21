using Application.Dto.UserDto;
using Application.Services.Auth;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using WebApi.Options;

namespace WebApi.Controllers
{
    [Route( "/api/auth" )]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private IAuthService _authService;
        private AuthCookieOptions _cookieOptions;

        public AuthController( IAuthService authService, IOptions<AuthCookieOptions> cookieOptions )
        {
            _authService = authService;
            _cookieOptions = cookieOptions.Value;
        }

        [HttpPost( "login" )]
        public async Task<ActionResult<int>> LoginUser( string login, string password )
        {
            UserAuthDto result = await _authService.LoginAsync( login, password );

            Response.Cookies.Append( _cookieOptions.JwtCookieName, result.Token.Value );

            return Ok( result.UserId );
        }

        [HttpPost( "register" )]
        public async Task<ActionResult<int>> RegisterUser( [FromBody] UserCreateDto dto )
        {
            UserAuthDto result = await _authService.RegisterUserAsync( dto );

            Response.Cookies.Append( _cookieOptions.JwtCookieName, result.Token.Value );

            return Ok( result.UserId );
        }

        [HttpGet( "check" )]
        public async Task<ActionResult<bool>> CheckAuthorized()
        {
            string? token = Request.Cookies[ "token" ];

            if ( string.IsNullOrEmpty( token ) )
            {
                return false;
            }

            bool result = await _authService.CheckAuthAsync( token );

            return Ok( result );
        }
    }
}
