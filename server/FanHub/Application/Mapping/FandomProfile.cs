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
                .ForMember( dest => dest.GameId,
                    opt => opt.Condition( ( src, dest, srcMember ) =>
                        src.GameId.HasValue && src.GameId.Value != default( int ) ) )
                .ForMember( dest => dest.Name,
                    opt => opt.Condition( ( src, dest, srcMember ) =>
                        src.Name is not null && !string.IsNullOrWhiteSpace( src.Name ) ) )
                .ForMember( dest => dest.Description,
                    opt => opt.Condition( ( src, dest, srcMember ) =>
                        src.Description is not null && !string.IsNullOrWhiteSpace( src.Description ) ) )
                .ForMember( dest => dest.Rules,
                    opt => opt.Condition( ( src, dest, srcMember ) =>
                        src.Rules is not null && !string.IsNullOrWhiteSpace( src.Rules ) ) )
                .ForMember( dest => dest.CoverImage,
                    opt => opt.Condition( ( src, dest, srcMember ) =>
                        !string.IsNullOrWhiteSpace( src.CoverImage ) ) );
        }
    }
}
