using Application.Dto.EventDto;
using AutoMapper;
using Domain.Entities;

public class EventProfile : Profile
{
    public EventProfile()
    {
        CreateMap<Event, EventReadDto>();

        CreateMap<EventCreateDto, Event>();

        CreateMap<EventUpdateDto, Event>();
    }
}