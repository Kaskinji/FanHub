using Application.Dto.UserDto;
using Application.Services.Auth;
using Application.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [Route( "/api/users" )]
    [ApiController]
    public class UserController : ControllerBase
    {
        private IUserService _userService;
        private IAuthService _authService;

        public UserController( IAuthService authService, IUserService UserService )
        {
            _authService = authService;
            _userService = UserService;
        }

        [Authorize( Policy = "AdminOnly" )]
        [HttpGet]
        public async Task<ActionResult<List<UserReadDto>>> GetUsers()
        {
            IReadOnlyList<UserReadDto> users = await _userService.GetAll();

            return Ok( users );
        }

        [Authorize]
        [HttpGet( "{id}" )]
        public async Task<ActionResult<UserReadDto>> GetUserById( int id )
        {
            UserReadDto user = await _userService.GetById( id );

            return Ok( user );
        }

        [HttpPost( "login" )]
        public async Task<ActionResult<UserAuthDto>> LoginUser( string login, string password )
        {
            UserAuthDto result = await _authService.LoginAsync( login, password );

            return Ok( result );
        }

        [HttpPost( "register" )]
        public async Task<ActionResult<UserAuthDto>> RegisterUser( [FromBody] UserCreateDto dto )
        {
            UserAuthDto result = await _authService.RegisterUserAsync( dto );

            return Ok( result );
        }

        [Authorize]
        [HttpPut( "{id}" )]
        public async Task<IActionResult> UpdateUser( int id, [FromBody] UserUpdateDto dto )
        {
            await _userService.Update( id, dto );

            return Ok();
        }

        [Authorize]
        [HttpDelete( "{id}" )]
        public async Task<IActionResult> DeleteUser( int id )
        {
            await _userService.DeleteAsync( id );

            return Ok();
        }
    }
}
