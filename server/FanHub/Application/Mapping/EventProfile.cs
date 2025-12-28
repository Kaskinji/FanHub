using Application.Dto.EventDto;
using AutoMapper;
using Domain.Entities;

public class EventProfile : Profile
{
    public EventProfile()
    {
        CreateMap<Event, EventReadDto>()
           .ForMember( dest => dest.OrganizerId,
               opt => opt.MapFrom( src => src.Organizer.Id ) )
           .ForMember( dest => dest.FandomId,
               opt => opt.MapFrom( src => src.Fandom.Id ) );

        CreateMap<EventCreateDto, Event>();

        CreateMap<EventUpdateDto, Event>();
    }
}