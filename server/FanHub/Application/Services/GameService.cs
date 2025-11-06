using Application.Dto.GameDto;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using FluentValidation;

namespace Application.Services
{
    public class GameService : BaseService<Game, GameCreateDto, GameReadDto, GameUpdateDto>, IGameService
    {
        public GameService( IGameRepository gameRepository,
            IMapper mapper,
            IValidator<Game> validator ) : base( gameRepository, mapper, validator )
        {
        }
    }
}
