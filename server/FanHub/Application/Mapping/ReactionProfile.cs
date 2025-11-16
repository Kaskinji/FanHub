using Application.Dto.ReactionDto;
using AutoMapper;
using Domain.Entities;
namespace Application.Mapping
{
    public class ReactionProfile : Profile
    {
        public ReactionProfile()
        {
            CreateMap<Reaction, ReactionReadDto>();

            CreateMap<ReactionCreateDto, Reaction>();

            CreateMap<ReactionUpdateDto, Reaction>();
        }
    }
}
