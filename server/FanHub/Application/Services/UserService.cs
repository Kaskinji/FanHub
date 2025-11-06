using Application.Dto.UserDto;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using FluentValidation;

namespace Application.Services
{
    public class UserService : BaseService<User, UserCreateDto, UserReadDto, UserUpdateDto>, IUserService
    {
        public UserService( IUserRepository userRepository,
            IMapper mapper,
            IValidator<User> validator ) : base( userRepository, mapper, validator )
        {
        }
    }
}
