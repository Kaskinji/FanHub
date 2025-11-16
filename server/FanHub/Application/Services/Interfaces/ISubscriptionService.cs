using Application.Dto.SubscriptionDto;
using Domain.Entities;

namespace Application.Services.Interfaces
{
    public interface ISubscriptionService : IBaseService<Subscription, SubscriptionCreateDto, SubscriptionReadDto, SubscriptionUpdateDto>
    {
    }
}
