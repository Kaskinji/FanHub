using Application.Dto.CategoryDto;
using AutoMapper;
using Domain.Entities;

namespace Application.Mapping
{
    public class CommentProfile : Profile
    {
        public CommentProfile()
        {
            CreateMap<Category, CategoryReadDto>();

            CreateMap<CategoryCreateDto, Category>();

            CreateMap<CategoryUpdateDto, Category>();
        }
    }
}
