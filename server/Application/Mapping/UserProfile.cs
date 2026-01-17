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

            CreateMap<UserUpdateDto, User>()
                .ForMember( dest => dest.Username, opt =>
                {
                    opt.Condition( src => !string.IsNullOrEmpty( src.Username ) );
                    opt.MapFrom( src => src.Username );
                } )
                .ForMember( dest => dest.Login, opt =>
                {
                    opt.Condition( src => !string.IsNullOrEmpty( src.Login ) );
                    opt.MapFrom( src => src.Login );
                } )
                .ForMember( dest => dest.Avatar, opt =>
                {
                    opt.Condition( src => src.Avatar != string.Empty );
                    opt.MapFrom( src => src.Avatar );
                } )
                .ForMember( dest => dest.PasswordHash, opt =>
                {
                    opt.Ignore();
                } );
        }
    }
}
