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

            CreateMap<UserCreateDto, User>()
                .ForMember( dest => dest.Id, opt => opt.Ignore() )
                .ForMember( dest => dest.PasswordHash, opt => opt.Ignore() )
                .ForMember( dest => dest.RegistrationDate, opt => opt.MapFrom( src => DateTime.UtcNow ) )
                .ForMember( dest => dest.Role, opt => opt.Ignore() );


            CreateMap<UserUpdateDto, User>()
                .ForMember( dest => dest.Id, opt => opt.Ignore() )
                .ForMember( dest => dest.PasswordHash, opt => opt.Ignore() )
                .ForMember( dest => dest.RegistrationDate, opt => opt.Ignore() );
        }
    }
}
