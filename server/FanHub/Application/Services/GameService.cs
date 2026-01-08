using Application.Dto.FandomDto;
using Application.Dto.GameDto;
using Application.Services.Interfaces;
using Application.Tools;
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
        private readonly IGameRepository _gameRepository;
        private IImageTools _imageTools;

        public GameService( IGameRepository repository,
            IMapper mapper,
            IValidator<Game> validator,
            ILogger<GameService> logger,
            IUnitOfWork unitOfWork,
            IImageTools imageTools ) : base( repository, mapper, validator, logger, unitOfWork )
        {
            _gameRepository = repository;
            _imageTools = imageTools;
        }

        public async Task<List<GameReadDto>> SearchGamesByNameAsync( string searchTerm )
        {
            List<Game> games = await _gameRepository.SearchGamesByNameAsync( searchTerm );
            return _mapper.Map<List<GameReadDto>>( games );
        }

        public async Task<List<GameReadDto>> SearchGamesByGenreAsync( string searchTerm )
        {
            List<Game> games = await _gameRepository.SearchGamesByGenreAsync( searchTerm );
            return _mapper.Map<List<GameReadDto>>( games );
        }

        protected async override Task CheckUnique( Game entity )
        {
            bool existing = await _gameRepository.IsGameExistAsync( entity );

            if ( existing is true )
            {
                throw new ArgumentException( "A game with that name already exists." );
            }
        }

        protected override async Task CleanupBeforeUpdate( Game entity, GameUpdateDto updateDto )
        {
            if ( entity.CoverImage != updateDto.CoverImage && string.IsNullOrEmpty( entity.CoverImage ) )
            {
                await _imageTools.TryDeleteImageAsync( entity.CoverImage );
            }
        }

        protected override async Task CleanupBeforeDelete( Game entity )
        {
            if ( !string.IsNullOrEmpty( entity.CoverImage ) )
            {
                await _imageTools.TryDeleteImageAsync( entity.CoverImage );
            }
        }
    }
}
