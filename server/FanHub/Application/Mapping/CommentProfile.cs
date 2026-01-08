using Application.Dto.CommentDto;
using AutoMapper;
using Domain.Entities;

namespace Application.Mapping
{
    public class CommentProfile : Profile
    {
        public CommentProfile()
        {
            CreateMap<Comment, CommentReadDto>();

            CreateMap<CommentCreateDto, Comment>();

            CreateMap<CommentUpdateDto, Comment>()
                .ForMember( dest => dest.Content,
                    opt => opt.Condition( ( src, dest, srcMember ) =>
                        srcMember is not null && !string.IsNullOrWhiteSpace( ( string )srcMember ) ) );

            CreateMap<Comment, CommentShowDto>()
                .ForMember( dest => dest.AuthorAvatar,
                    opt => opt.MapFrom( src => src.User != null ? src.User.Avatar : string.Empty ) )
                .ForMember( dest => dest.AuthorUsername,
                    opt => opt.MapFrom( src => src.User != null ? src.User.Username : string.Empty ) );
        }
    }
}
