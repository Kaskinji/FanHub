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

            CreateMap<PostUpdateDto, Post>()
                .ForMember( dest => dest.CategoryId,
                    opt => opt.Condition( ( src, dest, srcMember ) =>
                        src.CategoryId.HasValue && src.CategoryId.Value != default ) )
                .ForMember( dest => dest.Title,
                    opt => opt.Condition( ( src, dest, srcMember ) =>
                        src.Title is not null && !string.IsNullOrWhiteSpace( src.Title ) ) )
                .ForMember( dest => dest.Content,
                    opt => opt.Condition( ( src, dest, srcMember ) =>
                        src.Content is not null && !string.IsNullOrWhiteSpace( src.Content ) ) )
                .ForMember( dest => dest.MediaContent,
                    opt => opt.MapFrom( src => src.MediaContent ) );
        }
    }
}