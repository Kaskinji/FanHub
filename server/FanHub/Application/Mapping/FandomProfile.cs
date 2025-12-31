using Application.Dto.FandomDto;
using AutoMapper;
using Domain.Entities;

namespace Application.Mapping
{
    public class FandomProfile : Profile
    {
        public FandomProfile()
        {
            CreateMap<Fandom, FandomStatsDto>()
           .ForMember( dest => dest.SubscribersCount,
                opt => opt.MapFrom( src => src.Subscriptions.Count ) )
            .ForMember( dest => dest.PostsCount,
                opt => opt.MapFrom( src => src.Posts.Count ) );

            CreateMap<Fandom, FandomReadDto>();

            CreateMap<FandomCreateDto, Fandom>();

            CreateMap<FandomUpdateDto, Fandom>()
            .ForAllMembers( opt => opt.Condition(
                ( src, dest, srcMember, destMember ) => srcMember is not null
            ) );
        }
    }
}
