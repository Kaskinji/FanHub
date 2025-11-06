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
        private IGameRepository _gameRepository;

        public FandomService( IFandomRepository fandomRepository,
            IGameRepository gameRepository,
            IMapper mapper,
            IValidator<Fandom> validator ) : base( fandomRepository, mapper, validator )
        {
            _gameRepository = gameRepository;
        }

        protected override async Task ExistEntities( Fandom fandom )
        {
            await _gameRepository.GetByIdAsyncThrow( fandom.GameId );
        }
    }
}
