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
        private IGameRepository _gameRepository;

        public FandomService( IFandomRepository fandomRepository,
            IGameRepository gameRepository,
            IMapper mapper,
            IValidator<Fandom> validator ) : base( fandomRepository, mapper, validator )
        {
            _gameRepository = gameRepository;
        }

        public override async Task<int> Create( FandomCreateDto dto )
        {
            Fandom fandom = new Fandom();

            fandom.Id = IdGenerator.GenerateId();
            _mapper.Map( dto, fandom );

            ExistGame( dto.GameId );

            await _validator.ValidateAndThrowAsync( fandom );

            await _repository.CreateAsync( fandom );

            return fandom.Id;
        }

        public override async Task Update( int id, FandomUpdateDto dto )
        {
            Fandom fandom = await _repository.GetByIdAsyncThrow( id );

            ExistGame( dto.GameId );

            _mapper.Map( dto, fandom );
            await _validator.ValidateAndThrowAsync( fandom );

            _repository.Update( fandom );
        }

        private async void ExistGame( int gameId )
        {
            await _gameRepository.GetByIdAsyncThrow( gameId );
        }
    }
}
