using Application.Dto.UserDto;
using Domain.Entities;

namespace Application.Services.Interfaces
{
    public interface IUserService : IBaseService<User, UserCreateDto, UserReadDto, UserUpdateDto>
    {
        Task ValidateUserUniqueness( string username, string login, int? excludeId = null );
        Task<bool> CheckLoginUniqueAsync( string login, int? excludeId = null );
        Task<bool> CheckUsernameUniqueAsync( string username, int? excludeId = null );
    }
}
