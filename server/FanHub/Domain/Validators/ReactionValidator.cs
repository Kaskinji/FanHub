using System.Linq;
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
                .NotEmpty().WithMessage( "Дата реакции обязательна" )
                .LessThanOrEqualTo( DateTime.UtcNow ).WithMessage( "Дата реакции не может быть в будущем" )
                .GreaterThanOrEqualTo( DateTime.UtcNow.AddYears( -1 ) ).WithMessage( "Дата реакции не может быть старше 1 года" );

            RuleFor( x => x.Type )
                .IsInEnum().WithMessage( "Некорректный тип реакции" )
                .Must( BeValidReactionType ).WithMessage( "Тип реакции не поддерживается" );

            RuleFor( x => x )
                .Must( BeUniqueReaction ).WithMessage( "Пользователь уже поставил реакцию на этот пост" )
                .When( x => x.UserId > 0 && x.PostId > 0 );
        }

        private bool BeValidReactionType( ReactionType reactionType )
        {
            var allowedReactions = new[]
            {
                ReactionType.Like,
                ReactionType.Dislike,
            };

            return allowedReactions.Contains( reactionType );
        }

        private bool BeUniqueReaction( Reaction reaction )
        {
            // проверка будет в сервисе с доступом к репозиторию
            return true;
        }
    }
}