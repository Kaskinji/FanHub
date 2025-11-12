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

        public override async Task<int> Create( GameCreateDto dto )
        {
            int gameId = await base.Create( dto );
            bool isUnique = await IsNameUniqueAsync( dto.Title );
            if ( !isUnique )
            {
                throw new ValidationException( "Игра с таким названием уже существует" );
            }
            return gameId;
        }

        public override async Task Update( int id, GameUpdateDto dto )
        {
            if ( !string.IsNullOrEmpty( dto.Title ) )
            {
                bool isUnique = await IsNameUniqueAsync( dto.Title, id );
                if ( !isUnique )
                {
                    throw new ValidationException( "Игра с таким названием уже существует" );
                }
            }

            await base.Update( id, dto );
        }

        public async Task<bool> IsNameUniqueAsync( string name, int? excludeId = null )
        {
            var existing = await _repository.FindAsync( f =>
                f.Title == name && ( excludeId == null || f.Id != excludeId.Value ) );
            return existing == null;
        }

        public async Task<List<GameReadDto>> GetGamesByDeveloperAsync( string developer )
        {
            var games = await _repository.FindAllAsync( g => g.Developer == developer );
            return _mapper.Map<List<GameReadDto>>( games );
        }

        public async Task<List<GameReadDto>> GetGamesByGenreAsync( string genre )
        {
            var games = await _repository.FindAllAsync( g => g.Genre == genre );
            return _mapper.Map<List<GameReadDto>>( games );
        }

        public async Task<List<GameReadDto>> SearchGamesAsync( string searchTerm )
        {
            var games = await _repository.FindAllAsync( g =>
                g.Title.Contains( searchTerm ) ||
                g.Description.Contains( searchTerm ) );
            return _mapper.Map<List<GameReadDto>>( games );
        }
    }
}
