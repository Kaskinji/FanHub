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

            CreateMap<CommentCreateDto, Comment>()
                .ForMember( dest => dest.CommentDate, opt => opt.Ignore() ); // Игнорируем!
            CreateMap<CommentUpdateDto, Comment>();

            CreateMap<Comment, CommentShowDto>()
                .ForMember( dest => dest.AuthorName,
                    opt => opt.MapFrom( src => src.User != null ? src.User.Username : "Unknown" ) )
                .ForMember( dest => dest.AuthorAvatar,
                    opt => opt.MapFrom( src => src.User != null ? src.User.Avatar : string.Empty ) )
                .ForMember( dest => dest.AuthorUsername,
                    opt => opt.MapFrom( src => src.User != null ? src.User.Login : string.Empty ) );
        }
    }
}
