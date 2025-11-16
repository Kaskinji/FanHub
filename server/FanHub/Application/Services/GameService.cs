using Application.Dto.GameDto;
using Application.Extensions;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Extensions;
using Domain.Repositories;
using FluentValidation;

namespace Application.Services
{
    public class GameService : BaseService<Game, GameCreateDto, GameReadDto, GameUpdateDto>, IGameService
    {
        private readonly IGameRepository _gameRepository;
        public GameService( IGameRepository gameRepository,
            IMapper mapper,
            IValidator<Game> validator ) : base( gameRepository, mapper, validator )
        {
            _gameRepository = gameRepository;
        }

        public override async Task<int> Create( GameCreateDto dto )
        {
            Game entity = new Game();
            entity.Id = IdGenerator.GenerateId();

            _mapper.Map( dto, entity );

            await ValidateGame( entity );

            await ExistEntities( entity );

            await _validator.ValidateAndThrowAsync( entity );

            await _repository.CreateAsync( entity );

            return entity.Id;
        }

        public override async Task Update( int id, GameUpdateDto dto )
        {
            Game entity = await _repository.GetByIdAsyncThrow( id );

            _mapper.Map( dto, entity );

            await ValidateGame( entity );

            await ExistEntities( entity );

            await _validator.ValidateAndThrowAsync( entity );

            _repository.Update( entity );
        }

        public async Task ValidateGame( Game entity )
        {
            bool isUnique = await CheckNameUniqueAsync( entity.Title, entity.Id );
            if ( !isUnique )
            {
                throw new ValidationException( "Игра с таким названием уже существует" );
            }
        }

        public async Task<bool> CheckNameUniqueAsync( string name, int? excludeId = null )
        {
            Game? existing = await _repository.FindAsync( f =>
                f.Title == name && ( excludeId == null || f.Id != excludeId.Value ) );
            return existing == null;
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
    }
}
