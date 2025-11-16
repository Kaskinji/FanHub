using Application.Dto.UserDto;
using AutoMapper;
using Domain.Entities;

namespace Application.Mapping
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<User, UserReadDto>();

            CreateMap<UserCreateDto, User>();

            CreateMap<UserUpdateDto, User>();
        }
    }
}
