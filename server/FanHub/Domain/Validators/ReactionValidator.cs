using Domain.Entities;
using Domain.Enums;
using FluentValidation;

namespace Domain.Validators
{
    public class ReactionValidator : AbstractValidator<Reaction>
    {
        public ReactionValidator()
        {
            RuleFor( x => x.UserId )
                .GreaterThan( 0 ).WithMessage( "User ID должен быть положительным числом" );

            RuleFor( x => x.PostId )
                .GreaterThan( 0 ).WithMessage( "Post ID должен быть положительным числом" );

            RuleFor( x => x.Date )
                .NotEmpty().WithMessage( "Дата реакции обязательна" );
            //.GreaterThanOrEqualTo( DateTime.UtcNow.AddMinutes( 1 ) ).WithMessage( "Дата реакции не может быть в будущем" );

            RuleFor( x => x.Type )
                .IsInEnum().WithMessage( "Некорректный тип реакции" )
                .Must( BeValidReactionType ).WithMessage( "Тип реакции не поддерживается" );
        }

        private bool BeValidReactionType( ReactionType reactionType )
        {
            ReactionType[] allowedReactions =
            {
                ReactionType.Like,
                ReactionType.Dislike,
            };

            return allowedReactions.Contains( reactionType );
        }
    }
}