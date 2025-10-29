using Domain.Entities;
using FluentValidation;

namespace Domain.Validators
{
    public class CommentValidator : AbstractValidator<Comment>
    {
        public CommentValidator()
        {
            RuleFor( x => x.Content )
                .NotEmpty().WithMessage( "Текст комментария не может быть пустым" )
                .MinimumLength( 1 ).WithMessage( "Комментарий должен содержать хотя бы 1 символ" )
                .MaximumLength( 500 ).WithMessage( "Комментарий не может превышать 500 символов" )
                .Must( content => !string.IsNullOrWhiteSpace( content ) ).WithMessage( "Комментарий не может состоять только из пробелов" )
                .Must( BeReasonableContent ).WithMessage( "Комментарий содержит подозрительный контент" );

            RuleFor( x => x.CommentDate )
                .NotEmpty().WithMessage( "Дата комментария обязательна" )
                .LessThanOrEqualTo( DateTime.UtcNow ).WithMessage( "Дата комментария не может быть в будущем" )
                .GreaterThanOrEqualTo( DateTime.UtcNow.AddYears( -1 ) ).WithMessage( "Дата комментария слишком старая" );

            RuleFor( x => x.PostId )
                .GreaterThan( 0 ).WithMessage( "ID поста должен быть положительным числом" );

            RuleFor( x => x.UserId )
                .GreaterThan( 0 ).WithMessage( "ID пользователя должен быть положительным числом" );

            // Валидация навигационных свойств (при создании через API)
            RuleFor( x => x.Post )
                .NotNull().When( x => x.PostId == 0 ).WithMessage( "Пост должен быть указан" );

            RuleFor( x => x.User )
                .NotNull().When( x => x.UserId == 0 ).WithMessage( "Пользователь должен быть указан" );
        }

        private bool BeReasonableContent( string content )
        {
            if ( string.IsNullOrEmpty( content ) ) return true;

            // Проверка на запрещенные слова (можно вынести в конфиг)
            var forbiddenWords = new[] { "спам", "реклама", "http://", "https://" };
            if ( forbiddenWords.Any( word => content.ToLower().Contains( word ) ) )
                return false;

            return true;
        }
    }
}