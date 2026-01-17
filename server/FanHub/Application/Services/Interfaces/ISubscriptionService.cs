using Application.Dto.SubscriptionDto;
using Domain.Entities;

namespace Application.Services.Interfaces
{
    public interface ISubscriptionService : IBaseService<Subscription, SubscriptionCreateDto, SubscriptionReadDto, SubscriptionUpdateDto>
    {
        Task<int?> GetSubscription( int fandomId, int userId );
    }
}
