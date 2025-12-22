using Application.Dto.UserDto;
using Application.Services.Auth;
using Application.Services.Interfaces;
using AutoMapper;
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
        private IMapper _mapper;

        public UserController( IAuthService authService, IUserService UserService, IMapper mapper )
        {
            _authService = authService;
            _userService = UserService;
            _mapper = mapper;
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
        public async Task<ActionResult<UserSafeReadDto>> GetUserById( int id )
        {
            UserReadDto user = await _userService.GetById( id );

            return Ok( _mapper.Map<UserSafeReadDto>( user ) );
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
