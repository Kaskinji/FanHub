using Application.Extensions;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Extensions;
using Domain.Repositories;
using FluentValidation;

namespace Application.Services
{
    public abstract class BaseService<TEntity, TCreateDto, TReadDto, TUpdateDto>
        : IBaseService<TEntity, TCreateDto, TReadDto, TUpdateDto>
        where TReadDto : class, new()
        where TEntity : Entity, new()
    {
        protected IBaseRepository<TEntity> _repository;
        protected IMapper _mapper;
        protected IValidator<TEntity> _validator;

        public BaseService( IBaseRepository<TEntity> repository, IMapper mapper, IValidator<TEntity> validator )
        {
            _repository = repository;
            _mapper = mapper;
            _validator = validator;
        }

        public virtual async Task<int> Create( TCreateDto dto )
        {
            TEntity entity = InitializeEntity( dto );

            _mapper.Map( dto, entity );

            await CheckUnique( entity );

            await ExistEntities( entity );

            await _validator.ValidateAndThrowAsync( entity );

            await _repository.CreateAsync( entity );

            return entity.Id;
        }

        public virtual async Task DeleteAsync( int id )
        {
            TEntity entity = await _repository.GetByIdAsyncThrow( id );

            _repository.Delete( entity );
        }

        public virtual async Task<List<TReadDto>> GetAll()
        {
            List<TEntity> entities = await _repository.GetAllAsync();

            return _mapper.Map<List<TReadDto>>( entities );
        }

        public virtual async Task<TReadDto> GetById( int id )
        {
            TEntity entity = await _repository.GetByIdAsyncThrow( id );

            TReadDto dto = new();
            _mapper.Map( entity, dto );

            return dto;
        }

        public virtual async Task Update( int id, TUpdateDto dto )
        {
            TEntity entity = await _repository.GetByIdAsyncThrow( id );

            _mapper.Map( dto, entity );

            await CheckUnique( entity );

            await ExistEntities( entity );

            await _validator.ValidateAndThrowAsync( entity );

            _repository.Update( entity );
        }

        protected virtual TEntity InitializeEntity( TCreateDto createDto )
        {
            TEntity entity = new TEntity();
            entity.Id = IdGenerator.GenerateId();

            return entity;
        }

        protected virtual Task CheckUnique( TEntity entity )
        {
            return Task.CompletedTask;
        }

        protected virtual Task ExistEntities( TEntity entity )
        {
            return Task.CompletedTask;
        }
    }
}
