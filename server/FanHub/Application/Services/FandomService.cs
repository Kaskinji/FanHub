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
        private readonly ISubscriptionRepository _subscriptionRepository;

        public FandomService( IFandomRepository fandomRepository,
            IGameRepository gameRepository,
            ISubscriptionRepository subscriptionRepository,
            IPostRepository postRepository,
            IMapper mapper,
            IValidator<Fandom> validator,
            ILogger<FandomService> logger,
            IUnitOfWork unitOfWork ) : base( fandomRepository, mapper, validator, logger, unitOfWork )
        {
            _fandomRepository = fandomRepository;
            _gameRepository = gameRepository;
            _subscriptionRepository = subscriptionRepository;
        }

        public override async Task<FandomReadDto> GetById( int id )
        {
            Fandom? entity = await _fandomRepository.GetByIdWithStatsAsync( id );

            return _mapper.Map<FandomReadDto>( entity );
        }

        public override async Task<List<FandomReadDto>> GetAll()
        {
            List<Fandom> fandoms = await _fandomRepository.GetAllAsync();

            return _mapper.Map<List<FandomReadDto>>( fandoms );
        }

        public async Task<List<FandomReadDto>> SearchByNameAsync( string searchTerm )
        {
            List<Fandom> fandoms = await _fandomRepository.SearchByNameWithStatsAsync( searchTerm?.ToLower() ?? "" );

            return _mapper.Map<List<FandomReadDto>>( fandoms );
        }

        public async Task<List<FandomReadDto>> SearchByNameAndGameIdAsync( string searchTerm, int gameId )
        {
            List<Fandom> fandoms = await _fandomRepository.SearchByNameAndGameWithStatsAsync(
                searchTerm?.ToLower() ?? "",
                gameId );

            return _mapper.Map<List<FandomReadDto>>( fandoms );
        }

        public async Task<List<FandomReadDto>> GetPopularAsync( int limit )
        {
            List<Fandom> fandoms = await _fandomRepository.GetPopularAsync( limit );

            return _mapper.Map<List<FandomReadDto>>( fandoms );
        }

        public async Task<List<FandomReadDto>> GetPopularByGameAsync( int gameId, int limit = 20 )
        {
            List<Fandom> fandoms = await _fandomRepository.GetPopularByGameAsync( gameId, limit );

            return _mapper.Map<List<FandomReadDto>>( fandoms );
        }
        protected override async Task CheckUnique( Fandom entity )
        {
            bool existing = await _fandomRepository.IsFandomExistAsync( entity );

            if ( existing is true )
            {
                throw new ArgumentException( "A fandom with this name already exists." );
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

        public async Task<FandomStatsDto> GetFandomWithStatsById( int id )
        {
            return _mapper.Map<FandomStatsDto>( await _fandomRepository.GetByIdWithStatsAsync( id ) );
        }
    }
}
