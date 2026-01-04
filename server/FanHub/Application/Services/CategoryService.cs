using Application.Dto.CategoryDto;
using Application.Dto.UserDto;
using Application.Services.Interfaces;
using Application.Tools;
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
        private IImageTools _imageTools;

        public CategoryService( ICategoryRepository repository,
            IMapper mapper,
            IValidator<Category> validator,
            ILogger<CategoryService> logger,
            IUnitOfWork unitOfWork,
            IImageTools imageTools )
        : base( repository, mapper, validator, logger, unitOfWork )
        {
            _categoryRepository = repository;
            _imageTools = imageTools;
        }

        public async Task<List<CategoryReadDto>> GetByNameAsync( string name )
        {
            List<Category> category = await _categoryRepository.SearchByNameAsync( name );

            return _mapper.Map<List<CategoryReadDto>>( category );
        }

        protected override Task CleanupBeforeUpdate( Category entity, CategoryUpdateDto updateDto )
        {
            if ( entity.Icon != updateDto.Icon && !string.IsNullOrEmpty( entity.Icon ) )
            {
                _imageTools.DeleteImage( entity.Icon );
            }

            return Task.CompletedTask;
        }

        protected override async Task CheckUnique( Category entity )
        {
            bool existing = await _categoryRepository.IsCategoryExistAsync( entity );

            if ( existing is true )
            {
                throw new ArgumentException( "A category with this name already exists." );
            }
        }

        protected override Task CleanupBeforeDelete( Category entity )
        {
            if ( !string.IsNullOrEmpty( entity.Icon ) )
            {
                _imageTools.DeleteImage( entity.Icon );
            }

            return Task.CompletedTask;
        }
    }
}