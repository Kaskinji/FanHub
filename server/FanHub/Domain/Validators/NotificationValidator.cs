using Domain.Entities;
using FluentValidation;

namespace Domain.Validators
{
    public class NotificationValidator : AbstractValidator<Notification>
    {
        public NotificationValidator()
        {
            RuleFor( x => x.UserId )
                .GreaterThan( 0 ).WithMessage( "UserId должен быть положительным числом" );

            RuleFor( x => x.Content )
                .NotEmpty().WithMessage( "Содержание уведомления обязательно" )
                .Length( 1, 500 ).WithMessage( "Содержание должно быть от 1 до 500 символов" )
                .Must( content => !string.IsNullOrWhiteSpace( content ) )
                .WithMessage( "Содержание не может состоять только из пробелов" );

            RuleFor( x => x.PostId )
                .GreaterThan( 0 ).WithMessage( "PostId должен быть положительным числом" )
                .When( x => x.PostId != 0 );

            RuleFor( x => x.EventId )
                .GreaterThan( 0 ).WithMessage( "EventId должен быть положительным числом" )
                .When( x => x.EventId != 0 );

            RuleFor( x => x )
                .Must( CheckReferences )
                .WithMessage( "Уведомление должно ссылаться на пост или событие" );
        }

        private bool CheckReferences( Notification notification )
        {
            int? postId = notification.PostId;
            int? eventId = notification.EventId;

            bool empty = postId is null && eventId is null;
            bool overflow = postId is not null && eventId is not null;

            if ( !empty && !overflow )
            {
                return false;
            }

            return true;
        }
    }
}