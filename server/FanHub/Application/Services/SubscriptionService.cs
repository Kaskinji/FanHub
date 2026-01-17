using Application.Dto.SubscriptionDto;
using Application.Services.Interfaces;
using AutoMapper;
using Domain.Entities;
using Domain.Extensions;
using Domain.Foundations;
using Domain.Repositories;
using FluentValidation;
using Microsoft.Extensions.Logging;

namespace Application.Services
{
    public class SubscriptionService : BaseService<Subscription, SubscriptionCreateDto, SubscriptionReadDto, SubscriptionUpdateDto>, ISubscriptionService
    {
        private readonly ISubscriptionRepository _subscriptionRepository;
        private readonly IUserRepository _userRepository;
        private readonly IFandomService _fandomService;

        public SubscriptionService(
            ISubscriptionRepository repository,
            IUserRepository userRepository,
            IFandomService fandomService,
            IMapper mapper,
            IValidator<Subscription> validator,
            ILogger<SubscriptionService> logger,
            IUnitOfWork unitOfWork )
            : base( repository, mapper, validator, logger, unitOfWork )
        {
            _subscriptionRepository = repository;
            _userRepository = userRepository;
            _fandomService = fandomService;
        }

        public async Task<int?> GetSubscription( int fandomId, int userId )
        {
            Subscription? existingSubscription = await _subscriptionRepository.FindAsync( s =>
                s.UserId == userId && s.FandomId == fandomId );

            return existingSubscription?.Id;
        }

        protected override Subscription InitializeEntity( SubscriptionCreateDto dto )
        {
            Subscription entity = new Subscription();
            entity.Date = DateTime.UtcNow;

            return entity;
        }

        protected override async Task ExistEntities( Subscription subscription )
        {
            await _userRepository.GetByIdAsyncThrow( subscription.UserId );
            await _fandomService.CheckCreator( subscription.UserId, subscription.FandomId );

            Subscription? existingSubscription = await _subscriptionRepository.FindAsync( s =>
                s.UserId == subscription.UserId && s.FandomId == subscription.FandomId );

            if ( existingSubscription is not null )
            {
                throw new ArgumentException( "Пользователь уже подписан на этот фандом" );
            }
        }
    }
}