using Application.Dto.GameDto;
using AutoMapper;
using Domain.Entities;

namespace Application.Mapping
{
    public class GameProfile : Profile
    {
        public GameProfile()
        {
            CreateMap<Game, GameReadDto>();

            CreateMap<GameCreateDto, Game>()
            .ForMember( dest => dest.Id, opt => opt.Ignore() );

            CreateMap<GameUpdateDto, Game>()
                .ForMember( dest => dest.Id, opt => opt.Ignore() )
                .ForMember( dest => dest.Title, opt => opt.Condition( src => src.Title != null ) )
                .ForMember( dest => dest.Description, opt => opt.Condition( src => src.Description != null ) )
                .ForMember( dest => dest.ReleaseDate, opt => opt.Condition( src =>
                    src.ReleaseDate.HasValue && src.ReleaseDate.Value != default ) )
                .ForMember( dest => dest.Developer, opt => opt.Condition( src => src.Developer != null ) )
                .ForMember( dest => dest.Publisher, opt => opt.Condition( src => src.Publisher != null ) )
                .ForMember( dest => dest.CoverImage, opt => opt.Condition( src => src.CoverImage != null ) )
                .ForMember( dest => dest.Genre, opt => opt.Condition( src => src.Genre != null ) );
        }
    }
}
