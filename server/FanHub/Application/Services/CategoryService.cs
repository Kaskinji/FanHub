using Application.Dto.CategoryDto;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using FluentValidation;
using Microsoft.Extensions.Logging;

namespace Application.Services
{
    public class CategoryService : BaseService<Category, CategoryCreateDto, CategoryReadDto, CategoryUpdateDto>, ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;
        public CategoryService( ICategoryRepository repository, IMapper mapper, IValidator<Category> validator, ILogger<CategoryService> logger )
        : base( repository, mapper, validator, logger )
        {
            _categoryRepository = repository;
        }

        public async Task<CategoryReadDto?> GetByNameAsync( string name )
        {
            Category? category = await _categoryRepository.FindAsync( c => c.Name == name );

            return category is not null ? _mapper.Map<CategoryReadDto>( category ) : null;
        }

        public async Task<List<CategoryReadDto>> SearchByNameAsync( string searchTerm )
        {
            List<Category> categories = await _categoryRepository.FindAllAsync( c =>
                c.Name.Contains( searchTerm ) );

            return _mapper.Map<List<CategoryReadDto>>( categories );
        }

        protected override async Task CheckUnique( Category entity )
        {
            Category? existing = await _categoryRepository.FindAsync( f =>
                f.Name == entity.Name );

            if ( existing is not null )
            {
                throw new ArgumentException( "Категория с таким названием уже существует" );
            }
        }
    }
}