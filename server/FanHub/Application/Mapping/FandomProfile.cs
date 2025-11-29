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

            CreateMap<FandomCreateDto, Fandom>();

            CreateMap<FandomUpdateDto, Fandom>();
        }
    }
}
