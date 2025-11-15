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

            CreateMap<CategoryCreateDto, Category>()
            .ForMember( dest => dest.Id, opt => opt.Ignore() );

            CreateMap<CategoryUpdateDto, Category>()
                .ForMember( dest => dest.Id, opt => opt.Ignore() );
        }
    }
}
