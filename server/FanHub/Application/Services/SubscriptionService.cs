using Application.Dto.SubscriptionDto;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Extensions;
using Domain.Repositories;
using FluentValidation;

namespace Application.Services
{
    public class SubscriptionService : BaseService<Subscription, SubscriptionCreateDto, SubscriptionReadDto, SubscriptionUpdateDto>, ISubscriptionService
    {
        private readonly ISubscriptionRepository _subscriptionRepository;
        private readonly IUserRepository _userRepository;
        private readonly IFandomRepository _fandomRepository;

        public SubscriptionService(
            ISubscriptionRepository repository,
            IUserRepository userRepository,
            IFandomRepository fandomRepository,
            IMapper mapper,
            IValidator<Subscription> validator )
            : base( repository, mapper, validator )
        {
            _subscriptionRepository = repository;
            _userRepository = userRepository;
            _fandomRepository = fandomRepository;
        }

        public override async Task<int> Create( SubscriptionCreateDto dto )
        {
            await IsUserAlreadySubscribed( dto );

            return await base.Create( dto );
        }

        public async Task IsUserAlreadySubscribed( SubscriptionCreateDto subscription )
        {
            Subscription? existingSubscription = await _subscriptionRepository.FindAsync( s =>
                s.UserId == subscription.UserId && s.FandomId == subscription.FandomId );

            if ( existingSubscription != null )
            {
                throw new ValidationException( "Пользователь уже подписан на этот фандом" );
            }
        }
        protected override async Task ExistEntities( Subscription subscription )
        {
            await _userRepository.GetByIdAsyncThrow( subscription.UserId );
            await _fandomRepository.GetByIdAsyncThrow( subscription.FandomId );
        }
    }
}