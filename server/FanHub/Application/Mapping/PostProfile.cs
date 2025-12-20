using Application.Dto.PostDto;
using AutoMapper;
using Domain.Entities;

namespace Application.Mapping
{
    public class PostProfile : Profile
    {
        public PostProfile()
        {
            CreateMap<Post, PostReadDto>()
            .ForMember( dest => dest.ReactionsCount,
               opt => opt.MapFrom( src => src.Reactions.Count ) );

            CreateMap<PostCreateDto, Post>();

            CreateMap<PostUpdateDto, Post>();
        }
    }
}