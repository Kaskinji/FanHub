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

            CreateMap<GameCreateDto, Game>();

            CreateMap<GameUpdateDto, Game>();
        }
    }
}
