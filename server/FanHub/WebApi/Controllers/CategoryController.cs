using Application.Dto.CategoryDto;
using Application.Services.Interfaces;
using Domain.Foundations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [Route( "/api/categories" )]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private ICategoryService _categoryService;
        private IUnitOfWork _unitOfWork;

        public CategoryController( ICategoryService categoryService, IUnitOfWork unitOfWork )
        {
            _categoryService = categoryService;
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<ActionResult<List<CategoryReadDto>>> GetCategories()
        {
            IReadOnlyList<CategoryReadDto> categories = await _categoryService.GetAll();

            return Ok( categories );
        }

        [HttpGet( "{id}" )]
        public async Task<ActionResult<CategoryReadDto>> GetCategoryById( int id )
        {
            CategoryReadDto category = await _categoryService.GetById( id );

            return Ok( category );
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<int>> CreateCategory( [FromBody] CategoryCreateDto dto )
        {
            int id = await _categoryService.Create( dto );

            await _unitOfWork.CommitAsync();

            return Ok( id );
        }

        [Authorize]
        [HttpPut( "{id}" )]
        public async Task<IActionResult> UpdateCategory( int id, [FromBody] CategoryUpdateDto dto )
        {
            await _categoryService.Update( id, dto );

            await _unitOfWork.CommitAsync();

            return Ok();
        }

        [Authorize]
        [HttpDelete( "{id}" )]
        public async Task<IActionResult> DeleteCategory( int id )
        {
            await _categoryService.DeleteAsync( id );

            await _unitOfWork.CommitAsync();

            return Ok();
        }
    }
}
