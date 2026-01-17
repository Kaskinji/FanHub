using Application.Dto.UserDto;
using AutoMapper;

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
