using Application.Dto.CategoryDto;
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
        public CategoryService( ICategoryRepository repository, IMapper mapper, IValidator<Category> validator )
        : base( repository, mapper, validator ) { }

        public override async Task<int> Create( CategoryCreateDto dto )
        {
            bool existingCategory = await IsNameUniqueAsync( dto.Name );
            if ( existingCategory )
            {
                throw new ValidationException( "Категория с таким названием уже существует" );
            }

            return await base.Create( dto );
        }

        public override async Task Update( int id, CategoryUpdateDto dto )
        {
            if ( !string.IsNullOrEmpty( dto.Name ) )
            {
                bool existingCategory = await IsNameUniqueAsync( dto.Name );
                if ( existingCategory )
                {
                    throw new ValidationException( "Категория с таким названием уже существует" );
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

        public async Task<CategoryReadDto?> GetByNameAsync( string name )
        {
            Category? category = await _repository.FindAsync( c => c.Name == name );
            return category != null ? _mapper.Map<CategoryReadDto>( category ) : null;
        }

        public async Task<List<CategoryReadDto>> SearchByNameAsync( string searchTerm )
        {
            List<Category> categories = await _repository.FindAllAsync( c =>
                c.Name.Contains( searchTerm ) );
            return _mapper.Map<List<CategoryReadDto>>( categories );
        }

        public async Task<List<CategoryReadDto>> GetPopularCategoriesAsync( int limit = 10 )
        {
            ICategoryRepository? categoryRepository = _repository as ICategoryRepository;
            if ( categoryRepository == null )
                throw new InvalidOperationException( "Repository must be ICategoryRepository" );
            List<Category> popularCategories = await categoryRepository.GetPopularCategoriesAsync( limit );
            return _mapper.Map<List<CategoryReadDto>>( popularCategories );
        }
    }
}
