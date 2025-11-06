using Application.Dto.CategoryDto;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Repositories;
using FluentValidation;

namespace Application.Services
{
    public class CategoryService : BaseService<Category, CategoryCreateDto, CategoryReadDto, CategoryUpdateDto>, ICategoryService
    {
        public CategoryService( ICategoryRepository categoryRepository,
            IMapper mapper,
            IValidator<Category> validator ) : base( categoryRepository, mapper, validator )
        {
        }
    }
}
