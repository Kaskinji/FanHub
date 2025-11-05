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

            CreateMap<PostCreateDto, Post>()
                .ForMember( dest => dest.Id, opt => opt.Ignore() );

            CreateMap<PostUpdateDto, Post>()
                .ForMember( dest => dest.Id, opt => opt.Ignore() )
                .ForMember( dest => dest.UserId, opt => opt.Condition( src => src.UserId.HasValue ) )
                .ForMember( dest => dest.FandomId, opt => opt.Condition( src => src.FandomId.HasValue ) )
                .ForMember( dest => dest.CategoryId, opt => opt.Condition( src => src.CategoryId.HasValue ) )
                .ForMember( dest => dest.Title, opt => opt.Condition( src => src.Title != null ) )
                .ForMember( dest => dest.Content, opt => opt.Condition( src => src.Content != null ) )
                .ForMember( dest => dest.PostDate, opt => opt.Condition( src =>
                    src.PostDate.HasValue && src.PostDate.Value != default ) )
                .ForMember( dest => dest.MediaContent, opt => opt.Condition( src => src.MediaContent != null ) )
                .ForMember( dest => dest.Status, opt => opt.Condition( src => src.Status.HasValue ) );
        }
    }
}