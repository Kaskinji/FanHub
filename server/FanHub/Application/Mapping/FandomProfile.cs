using Application.Dto.FandomDto;
using AutoMapper;
using Domain.Entities;

namespace Application.Mapping
{
    public class FandomProfile : Profile
    {
        public FandomProfile()
        {
            CreateMap<Fandom, FandomReadDto>();

            CreateMap<FandomCreateDto, Fandom>()
            .ForMember( dest => dest.Id, opt => opt.Ignore() );

            CreateMap<FandomUpdateDto, Fandom>()
                .ForMember( dest => dest.Id, opt => opt.Ignore() )
                .ForMember( dest => dest.Name, opt => opt.Condition( src => src.Name != null ) )
                .ForMember( dest => dest.GameId, opt => opt.Condition( src => src.GameId != null ) )
                .ForMember( dest => dest.CreationDate, opt => opt.Condition( src =>
                    src.CreationDate.HasValue && src.CreationDate.Value != default ) )
                .ForMember( dest => dest.Rules, opt => opt.Condition( src => src.Rules != null ) )
                .ForMember( dest => dest.Description, opt => opt.Condition( src => src.Description != null ) );
        }
    }
}
