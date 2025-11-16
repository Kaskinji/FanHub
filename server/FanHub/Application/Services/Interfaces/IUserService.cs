using Application.Dto.UserDto;
using Domain.Entities;

namespace Application.Services.Interfaces
{
    public interface IUserService : IBaseService<User, UserCreateDto, UserReadDto, UserUpdateDto>
    {
    }
}
