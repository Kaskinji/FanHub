using Application.Dto.CategoryDto;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Foundations;
using Domain.Repositories;
using FluentValidation;
using Microsoft.Extensions.Logging;

namespace Application.Services
{
    public class CategoryService : BaseService<Category, CategoryCreateDto, CategoryReadDto, CategoryUpdateDto>, ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;

        public CategoryService( ICategoryRepository repository, IMapper mapper, IValidator<Category> validator, ILogger<CategoryService> logger, IUnitOfWork unitOfWork )
        : base( repository, mapper, validator, logger, unitOfWork )
        {
            _categoryRepository = repository;
        }

        public async Task<List<CategoryReadDto>> GetByNameAsync( string name )
        {
            List<Category> category = await _categoryRepository.SearchByNameAsync( name );

            return _mapper.Map<List<CategoryReadDto>>( category );
        }

        protected override async Task CheckUnique( Category entity )
        {
            bool existing = await _categoryRepository.IsCategoryExistAsync( entity );

            if ( existing is true )
            {
                throw new ArgumentException( "A category with this name already exists." );
            }
        }
    }
}