using Application.Dto.UserDto;
using Domain.Entities;

namespace Application.Services.Interfaces
{
    public interface IUserService : IBaseService<User, UserCreateDto, UserReadDto, UserUpdateDto>
    {
        public Task<int?> GetUserIdByCredentialsAsync( string login, string password );
    }
}
