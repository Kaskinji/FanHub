using Application.Dto.FandomDto;
using Application.Extensions;
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
        private readonly IFandomRepository _fandomRepository;
        private readonly IGameRepository _gameRepository;
        private readonly IPostRepository _postRepository;
        private readonly ISubscriptionRepository _subscriptionRepository;

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
            _fandomRepository = fandomRepository;
        }

        public override async Task<int> Create( FandomCreateDto dto )
        {
            Fandom entity = new Fandom();
            entity.Id = IdGenerator.GenerateId();
            entity.CreationDate = DateTime.UtcNow;

            _mapper.Map( dto, entity );

            await CheckFandomNameUnique( entity );

            await ExistEntities( entity );

            await _validator.ValidateAndThrowAsync( entity );

            await _repository.CreateAsync( entity );

            return entity.Id;
        }

        public override async Task Update( int id, FandomUpdateDto dto )
        {
            Fandom entity = await _repository.GetByIdAsyncThrow( id );

            _mapper.Map( dto, entity );

            if ( !string.IsNullOrEmpty( dto.Name ) )
            {
                await CheckFandomNameUnique( entity );
            }

            await ExistEntities( entity );

            await _validator.ValidateAndThrowAsync( entity );

            _repository.Update( entity );
        }

        public async Task<bool> CheckNameUniqueAsync( string name, int? excludeId = null )
        {
            Fandom? existing = await _fandomRepository.FindAsync( f =>
                f.Name == name && ( excludeId == null || f.Id != excludeId.Value ) );
            return existing == null;
        }

        public async Task<List<FandomReadDto>> SearchByNameAsync( string searchTerm )
        {
            List<Fandom>? fandoms = await _fandomRepository.FindAllAsync( f =>
                f.Name.Contains( searchTerm ) );
            return _mapper.Map<List<FandomReadDto>>( fandoms );
        }

        protected override async Task ExistEntities( Fandom entity )
        {
            await _gameRepository.GetByIdAsyncThrow( entity.GameId );
        }

        public async Task CheckFandomNameUnique( Fandom entity )
        {
            bool isUnique = await CheckNameUniqueAsync( entity.Name, entity.Id );
            if ( !isUnique )
            {
                throw new ValidationException( "Фандом с таким названием уже существует" );
            }
        }
    }
}
