using Application.Dto.FandomDto;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Extensions;
using Domain.Foundations;
using Domain.Repositories;
using FluentValidation;
using Microsoft.Extensions.Logging;

namespace Application.Services
{
    public class FandomService : BaseService<Fandom, FandomCreateDto, FandomReadDto, FandomUpdateDto>, IFandomService
    {
        private readonly IFandomRepository _fandomRepository;
        private readonly IGameRepository _gameRepository;

        public FandomService( IFandomRepository fandomRepository,
            IGameRepository gameRepository,
            IPostRepository postRepository,
            IMapper mapper,
            IValidator<Fandom> validator,
            ILogger<FandomService> logger,
            IUnitOfWork unitOfWork ) : base( fandomRepository, mapper, validator, logger, unitOfWork )
        {
            _fandomRepository = fandomRepository;
            _gameRepository = gameRepository;
        }

        public async Task<List<FandomReadDto>> SearchByNameAsync( string searchTerm )
        {
            List<Fandom>? fandoms = await _fandomRepository.FindAllAsync( f =>
                  f.Name.ToLower().Contains( searchTerm.ToLower() ) );

            if ( fandoms == null )
            {
                return new List<FandomReadDto>();
            }

            return _mapper.Map<List<FandomReadDto>>( fandoms );
        }

        public async Task<List<FandomReadDto>> SearchByNameAndGameIdAsync( string searchTerm, int gameId )
        {
            List<Fandom> fandoms;
            Game? game = await _gameRepository.GetByIdAsync( gameId );
            if ( game == null )
            {
                //добав конкретный тип исключения
                throw new Exception( $"Game with id {gameId} not found" );
            }

            if ( string.IsNullOrWhiteSpace( searchTerm ) )
            {
                fandoms = await _fandomRepository.FindAllAsync( f =>
                    f.GameId == gameId );

                return _mapper.Map<List<FandomReadDto>>( fandoms );
            }

            fandoms = await _fandomRepository.FindAllAsync( f =>
                f.GameId == gameId &&
                f.Name.ToLower().Contains( searchTerm.ToLower() ) );

            if ( fandoms == null || fandoms.Count == 0 )
            {
                return new List<FandomReadDto>();
            }

            return _mapper.Map<List<FandomReadDto>>( fandoms );
        }
        protected override async Task CheckUnique( Fandom entity )
        {
            Fandom? existing = await _fandomRepository.FindAsync( f =>
                f.Name == entity.Name );

            if ( existing is not null )
            {
                throw new ArgumentException( "Фандом с таким названием уже существует" );
            }
        }

        protected override Fandom InitializeEntity( FandomCreateDto dto )
        {
            Fandom entity = new Fandom();
            entity.CreationDate = DateTime.UtcNow;

            return entity;
        }

        protected override async Task ExistEntities( Fandom entity )
        {
            await _gameRepository.GetByIdAsyncThrow( entity.GameId );
        }
    }
}
