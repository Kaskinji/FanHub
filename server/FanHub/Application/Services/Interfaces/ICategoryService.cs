using Application.Dto.CategoryDto;
using Domain.Entities;

namespace Application.Services.Interfaces;

public interface ICategoryService : IBaseService<Category, CategoryCreateDto, CategoryReadDto, CategoryUpdateDto>
{
    Task CheckCategoryNameUnique( Category entity );
    Task<bool> CheckNameUniqueAsync( string name, int? excludeId = null );
    Task<CategoryReadDto?> GetByNameAsync( string name );
    Task<List<CategoryReadDto>> SearchByNameAsync( string searchTerm );
    Task<List<CategoryReadDto>> GetPopularCategoriesAsync( int limit = 10 );
}