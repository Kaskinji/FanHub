using Application.Dto.GameDto;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Foundations;
using Domain.Repositories;
using FluentValidation;
using Microsoft.Extensions.Logging;

namespace Application.Services
{
    public class GameService : BaseService<Game, GameCreateDto, GameReadDto, GameUpdateDto>, IGameService
    {
        public GameService( IGameRepository gameRepository,
            IMapper mapper,
            IValidator<Game> validator,
            ILogger<GameService> logger,
            IUnitOfWork unitOfWork ) : base( gameRepository, mapper, validator, logger, unitOfWork )
        {
        }

        public async Task<List<GameReadDto>> GetGamesByDeveloperAsync( string developer )
        {
            List<Game> games = await _repository.FindAllAsync( g => g.Developer == developer );

            return _mapper.Map<List<GameReadDto>>( games );
        }

        public async Task<List<GameReadDto>> GetGamesByGenreAsync( string genre )
        {
            List<Game> games = await _repository.FindAllAsync( g => g.Genre == genre );

            return _mapper.Map<List<GameReadDto>>( games );
        }

        public async Task<List<GameReadDto>> SearchGamesAsync( string searchTerm )
        {
            List<Game> games = await _repository.FindAllAsync( g =>
                g.Title.Contains( searchTerm ) ||
                g.Description.Contains( searchTerm ) );

            return _mapper.Map<List<GameReadDto>>( games );
        }

        protected async override Task CheckUnique( Game game )
        {
            Game? existingGame = await _repository.FindAsync( f =>
                f.Title == game.Title );

            if ( existingGame is not null )
            {
                throw new ArgumentException( "Игра с таким названием уже существует" );
            }
        }
    }
}
