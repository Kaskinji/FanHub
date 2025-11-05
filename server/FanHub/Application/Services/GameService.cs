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
    public class GameService : IGameService
    {
        private IGameRepository _repository;
        private IMapper _mapper;
        private IValidator<Game> _validator;

        public GameService( IGameRepository gameRepository,
            IMapper mapper,
            IValidator<Game> validator )
        {
            _repository = gameRepository;
            _mapper = mapper;
            _validator = validator;
        }

        public async Task<int> Create( GameCreateDto dto )
        {
            Game game = new Game();

            game.Id = IdGenerator.GenerateId();
            _mapper.Map( dto, game );

            await _validator.ValidateAndThrowAsync( game );

            await _repository.CreateAsync( game );

            return game.Id;
        }

        public async Task Delete( int id )
        {
            Game game = await _repository.GetByIdAsyncThrow( id );

            _repository.Delete( game );
        }

        public async Task<List<GameReadDto>> GetAll()
        {
            List<Game> games = await _repository.GetAllAsync();

            return _mapper.Map<List<GameReadDto>>( games );
        }

        public async Task<GameReadDto> GetById( int id )
        {
            Game game = await _repository.GetByIdAsyncThrow( id );

            GameReadDto gameReadDto = new();
            _mapper.Map( game, gameReadDto );

            return gameReadDto;
        }

        public async Task Update( int id, GameUpdateDto gameDto )
        {
            Game game = await _repository.GetByIdAsyncThrow( id );

            _mapper.Map( gameDto, game );
            await _validator.ValidateAndThrowAsync( game );

            _repository.Update( game );
        }
    }
}
