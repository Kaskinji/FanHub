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

        public FandomService( IFandomRepository fandomRepository,
            IGameRepository gameRepository,
            IPostRepository postRepository,
            IMapper mapper,
            IValidator<Fandom> validator ) : base( fandomRepository, mapper, validator )
        {
            _fandomRepository = fandomRepository;
            _gameRepository = gameRepository;
        }

        public async Task<List<FandomReadDto>> SearchByNameAsync( string searchTerm )
        {
            List<Fandom>? fandoms = await _fandomRepository.FindAllAsync( f =>
                f.Name.Contains( searchTerm ) );

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
        protected override Fandom InitializeEntity()
        {
            Fandom entity = new Fandom();
            entity.Id = IdGenerator.GenerateId();
            entity.CreationDate = DateTime.UtcNow;

            return entity;
        }

        protected override async Task ExistEntities( Fandom entity )
        {
            await _gameRepository.GetByIdAsyncThrow( entity.GameId );
        }
    }
}
