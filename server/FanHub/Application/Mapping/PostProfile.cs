using Application.Dto.PostDto;
using AutoMapper;
using Domain.Entities;

namespace Application.Mapping
{
    public class PostProfile : Profile
    {
        public PostProfile()
        {
            CreateMap<Post, PostReadDto>();

            CreateMap<PostCreateDto, Post>();

            CreateMap<PostUpdateDto, Post>();
        }
    }
}