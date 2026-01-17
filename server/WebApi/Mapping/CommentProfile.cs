using Application.Dto.CommentDto;
using AutoMapper;

namespace WebApi.Mapping
{
    public class CommentProfile : Profile
    {
        public CommentProfile()
        {
            CreateMap<WebApi.Contracts.CommentDto.CommentCreateDto, CommentCreateDto>();
        }
    }
}
