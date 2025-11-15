using Application.Dto.CategoryDto;
using Application.Extensions;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Extensions;
using Domain.Repositories;
using FluentValidation;

namespace Application.Services
{
    public class CategoryService : BaseService<Category, CategoryCreateDto, CategoryReadDto, CategoryUpdateDto>, ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;
        public CategoryService( ICategoryRepository repository, IMapper mapper, IValidator<Category> validator )
        : base( repository, mapper, validator )
        {
            _categoryRepository = repository;
        }

        public override async Task<int> Create( CategoryCreateDto dto )
        {
            Category entity = new Category();
            entity.Id = IdGenerator.GenerateId();

            _mapper.Map( dto, entity );

            await IsCategoryNameUnique( entity );

            await ExistEntities( entity );

            await _validator.ValidateAndThrowAsync( entity );

            await _repository.CreateAsync( entity );

            return entity.Id;
        }

        public override async Task Update( int id, CategoryUpdateDto dto )
        {
            Category entity = await _repository.GetByIdAsyncThrow( id );

            _mapper.Map( dto, entity );

            await IsCategoryNameUnique( entity );

            await ExistEntities( entity );

            await _validator.ValidateAndThrowAsync( entity );

            _repository.Update( entity );
        }

        public async Task IsCategoryNameUnique( Category entity )
        {
            bool existingCategory = await IsNameUniqueAsync( entity.Name, entity.Id );
            if ( existingCategory )
            {
                throw new ValidationException( "Категория с таким названием уже существует" );
            }
        }

        public async Task<bool> IsNameUniqueAsync( string name, int? excludeId = null )
        {
            Category? existing = await _categoryRepository.FindAsync( f =>
                f.Name == name && ( excludeId == null || f.Id != excludeId.Value ) );
            return existing == null;
        }

        public async Task<CategoryReadDto?> GetByNameAsync( string name )
        {
            Category? category = await _categoryRepository.FindAsync( c => c.Name == name );
            return category != null ? _mapper.Map<CategoryReadDto>( category ) : null;
        }

        public async Task<List<CategoryReadDto>> SearchByNameAsync( string searchTerm )
        {
            List<Category> categories = await _categoryRepository.FindAllAsync( c =>
                c.Name.Contains( searchTerm ) );
            return _mapper.Map<List<CategoryReadDto>>( categories );
        }

        public async Task<List<CategoryReadDto>> GetPopularCategoriesAsync( int limit = 10 )
        {
            if ( _categoryRepository == null )
                throw new InvalidOperationException( "Repository must be ICategoryRepository" );
            List<Category> popularCategories = await _categoryRepository.GetPopularCategoriesAsync( limit );
            return _mapper.Map<List<CategoryReadDto>>( popularCategories );
        }
    }
}
