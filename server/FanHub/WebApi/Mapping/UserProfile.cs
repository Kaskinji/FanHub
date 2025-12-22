using Application.Dto.UserDto;
using AutoMapper;
using Domain.Entities;

namespace WebApi.Mapping
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<UserReadDto, UserSafeReadDto>();
        }
    }
}
