using Application.Dto.PostDto;
using Application.Dto.ReactionDto;
using AutoMapper;
using Domain.Entities;
using Domain.Enums;

namespace Application.Mapping
{
    public class PostProfile : Profile
    {
        public PostProfile()
        {
            CreateMap<Post, PostReadDto>();

            CreateMap<Post, PostStatsDto>()
                .ForMember( dest => dest.CommentsCount,
                    opt => opt.MapFrom( src => src.Comments.Count ) )
                .ForMember( dest => dest.ReactionsSummaries,
                    opt => opt.MapFrom( src =>
                       Enum.GetValues( typeof( ReactionType ) )
                            .Cast<ReactionType>()
                            .Select( rt => new ReactionSummaryDto
                            {
                                ReactionType = rt,
                                Count = src.Reactions.Count( r => r.Type == rt )
                            } )
                            .ToList()
                    ) );

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