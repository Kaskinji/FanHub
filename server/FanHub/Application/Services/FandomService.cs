using Application.Dto.FandomDto;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Extensions;
using Domain.Repositories;
using FluentValidation;

namespace Application.Services
{
    public class FandomService : BaseService<Fandom, FandomCreateDto, FandomReadDto, FandomUpdateDto>, IFandomService
    {
        public FandomService( IFandomRepository fandomRepository,
            IGameRepository gameRepository,
            IPostRepository postRepository,
            ISubscriptionRepository subscriptionRepository,
            IMapper mapper,
            IValidator<Fandom> validator ) : base( fandomRepository, mapper, validator )
        {
            _gameRepository = gameRepository;
            _postRepository = postRepository;
            _subscriptionRepository = subscriptionRepository;
        }

        public override async Task<int> Create( FandomCreateDto dto )
        {
            int fandomId = await base.Create( dto );
            Fandom? createdFandom = await _repository.GetByIdAsync( fandomId );
            createdFandom.CreationDate = DateTime.UtcNow;

            bool isUnique = await IsNameUniqueAsync( dto.Name, createdFandom.Id );
            if ( !isUnique )
            {
                throw new ValidationException( "Фандом с таким названием уже существует" );
            }

            _repository.Update( createdFandom );

            return fandomId;
        }

        public override async Task Update( int id, FandomUpdateDto dto )
        {
            if ( !string.IsNullOrEmpty( dto.Name ) )
            {
                bool isUnique = await IsNameUniqueAsync( dto.Name, id );
                if ( !isUnique )
                {
                    throw new ValidationException( "Фандом с таким названием уже существует" );
                }
            }

            await base.Update( id, dto );
        }

        public async Task<bool> IsNameUniqueAsync( string name, int? excludeId = null )
        {
            var existing = await _repository.FindAsync( f =>
                f.Name == name && ( excludeId == null || f.Id != excludeId.Value ) );
            return existing == null;
        }

        public async Task<List<FandomReadDto>> SearchByNameAsync( string searchTerm )
        {
            var fandoms = await _repository.FindAllAsync( f =>
                f.Name.Contains( searchTerm ) );
            return _mapper.Map<List<FandomReadDto>>( fandoms );
        }

        protected override async Task ExistEntities( Fandom fandom )
        {
            await _gameRepository.GetByIdAsyncThrow( fandom.GameId );
        }

        private IGameRepository _gameRepository;
        private readonly IPostRepository _postRepository;
        private readonly ISubscriptionRepository _subscriptionRepository;
    }
}
