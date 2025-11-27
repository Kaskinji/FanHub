using Application.Dto.UserDto;
using Application.Services.Auth;
using Application.Services.Interfaces;
using Domain.Foundations;
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
        private IUnitOfWork _unitOfWork;

        public UserController( IAuthService authService, IUserService UserService, IUnitOfWork unitOfWork )
        {
            _authService = authService;
            _userService = UserService;
            _unitOfWork = unitOfWork;
        }


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

            await _unitOfWork.CommitAsync();

            return Ok( result );
        }

        [HttpPost( "register" )]
        public async Task<ActionResult<UserAuthDto>> RegisterUser( [FromBody] UserCreateDto dto )
        {
            UserAuthDto result = await _authService.RegisterUserAsync( dto );

            await _unitOfWork.CommitAsync();

            return Ok( result );
        }

        [Authorize]
        [HttpPut( "{id}" )]
        public async Task<IActionResult> UpdateUser( int id, [FromBody] UserUpdateDto dto )
        {
            await _userService.Update( id, dto );

            await _unitOfWork.CommitAsync();

            return Ok();
        }

        [Authorize]
        [HttpDelete( "{id}" )]
        public async Task<IActionResult> DeleteUser( int id )
        {
            await _userService.DeleteAsync( id );

            await _unitOfWork.CommitAsync();

            return Ok();
        }
    }
}
