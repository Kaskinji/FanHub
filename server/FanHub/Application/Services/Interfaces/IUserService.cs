using Application.Dto.UserDto;
using Domain.Entities;

namespace Application.Services.Interfaces
{
    public interface IUserService : IBaseService<User, UserCreateDto, UserReadDto, UserUpdateDto>
    {
        Task ValidateUserUniqueness( string username, string login, int? excludeId = null );
        Task<bool> IsLoginUniqueAsync( string login, int? excludeId = null );
        Task<bool> IsUsernameUniqueAsync( string username, int? excludeId = null );
    }
}
