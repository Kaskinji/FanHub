using Application.Dto.EventDto;
using Application.Dto.FandomDto;
using Application.Dto.NotificationDto;
using Application.Services.Interfaces;
using Application.Tools;
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
        private readonly IFandomNotificationService _notificationService;
        private readonly IFandomRepository _fandomRepository;
        private readonly IGameRepository _gameRepository;
        private readonly IImageTools _imageTools;

        public FandomService( IFandomNotificationService notificationService,
            IFandomRepository fandomRepository,
            IGameRepository gameRepository,
            ISubscriptionRepository subscriptionRepository,
            IPostRepository postRepository,
            IMapper mapper,
            IValidator<Fandom> validator,
            ILogger<FandomService> logger,
            IUnitOfWork unitOfWork
,
            IImageTools imageTools ) : base( fandomRepository, mapper, validator, logger, unitOfWork )
        {
            _fandomRepository = fandomRepository;
            _gameRepository = gameRepository;
            _notificationService = notificationService;
            _imageTools = imageTools;
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

        public async Task<List<FandomStatsDto>> SearchByNameAsync( string searchTerm )
        {
            List<Fandom> fandoms = await _fandomRepository.SearchByNameWithStatsAsync( searchTerm?.ToLower() ?? "" );

            return _mapper.Map<List<FandomStatsDto>>( fandoms );
        }

        public override async Task<bool> CheckCreator( int creatorId, int entityId )
        {
            Fandom fandom = await _fandomRepository.GetByIdAsyncThrow( entityId );

            return fandom.CreatorId == creatorId;
        }

        public async Task Notify( FandomNotificationCreateDto dto )
        {
            await _notificationService.Notify( dto );
        }

        public async Task<List<FandomStatsDto>> SearchByNameAndGameIdAsync( string searchTerm, int gameId )
        {
            List<Fandom> fandoms = await _fandomRepository.SearchByNameAndGameWithStatsAsync(
                searchTerm?.ToLower() ?? "",
                gameId );

            return _mapper.Map<List<FandomStatsDto>>( fandoms );
        }

        public async Task<List<FandomReadDto>> GetPopularAsync( int limit )
        {
            List<Fandom> fandoms = await _fandomRepository.GetPopularAsync( limit );

            return _mapper.Map<List<FandomReadDto>>( fandoms );
        }

        public async Task<List<FandomReadDto>> GetPopularByGameAsync( int gameId, int? limit = null )
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

        protected override async Task CleanupBeforeUpdate( Fandom entity, FandomUpdateDto updateDto )
        {
            if ( entity.CoverImage != updateDto.CoverImage && !string.IsNullOrEmpty( entity.CoverImage ) )
            {
                await _imageTools.TryDeleteImageAsync( entity.CoverImage );
            }
        }

        protected override async Task CleanupBeforeDelete( Fandom entity )
        {
            if ( !string.IsNullOrEmpty( entity.CoverImage ) )
            {
                await _imageTools.TryDeleteImageAsync( entity.CoverImage );
            }
        }
    }
}
