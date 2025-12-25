using Application.Dto.AuthDto;
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
        private CookieOptions _options;

        public AuthController( IAuthService authService, IOptions<AuthCookieOptions> cookieOptions )
        {
            _authService = authService;
            _cookieOptions = cookieOptions.Value;
            _options = new CookieOptions
            {
                HttpOnly = _cookieOptions.HttpOnly,
                Secure = _cookieOptions.Secure,
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddDays( _cookieOptions.ExpireDays ),
                Path = "/",
                Domain = "localhost"
            };
        }

        [HttpPost( "login" )]
        public async Task<ActionResult<int>> LoginUser( [FromBody] AuthUserDto authUserDto )
        {
            UserAuthResultDto result = await _authService.LoginAsync( authUserDto.Login, authUserDto.Password );

            Response.Cookies.Append( _cookieOptions.JwtCookieName, result.Token.Value, _options );

            return Ok( result.UserId );
        }

        [HttpPost( "logout" )]
        public IActionResult LogoutUser( [FromBody] UserCreateDto dto )
        {
            Response.Cookies.Delete( _cookieOptions.JwtCookieName, _options );

            return Ok();
        }

        [HttpPost( "register" )]
        public async Task<ActionResult<int>> RegisterUser( [FromBody] UserCreateDto dto )
        {
            UserAuthResultDto result = await _authService.RegisterUserAsync( dto );

            Response.Cookies.Append( _cookieOptions.JwtCookieName, result.Token.Value, _options );

            return Ok( result.UserId );
        }

        [HttpGet( "check" )]
        public async Task<ActionResult<bool>> CheckAuthorized()
        {
            string? token = Request.Cookies[ _cookieOptions.JwtCookieName ];

            if ( string.IsNullOrEmpty( token ) )
            {
                return false;
            }

            bool result = await _authService.CheckAuthAsync( token );

            return Ok( result );
        }
    }
}
