using Application.Dto.PostDto;
using AutoMapper;

namespace WebApi.Mapping
{
    public class PostProfile : Profile
    {
        public PostProfile()
        {
            CreateMap<WebApi.Contracts.PostDto.PostCreateDto, PostCreateDto>();
        }
    }
}
