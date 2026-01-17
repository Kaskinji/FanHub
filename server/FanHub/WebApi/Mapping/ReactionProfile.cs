using Application.Dto.ReactionDto;
using AutoMapper;

namespace WebApi.Mapping
{
    public class ReactionProfile : Profile
    {
        public ReactionProfile()
        {
            CreateMap<WebApi.Contracts.ReactionDto.ReactionCreateDto, ReactionCreateDto>();
        }
    }
}
