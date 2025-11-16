using Application.Dto.CategoryDto;
using Domain.Entities;

namespace Application.Services.Interfaces;

public interface ICategoryService : IBaseService<Category, CategoryCreateDto, CategoryReadDto, CategoryUpdateDto>
{
    Task<CategoryReadDto?> GetByNameAsync( string name );
    Task<List<CategoryReadDto>> SearchByNameAsync( string searchTerm );
}