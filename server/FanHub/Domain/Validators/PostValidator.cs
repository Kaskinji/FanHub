using Domain.Entities;
using FluentValidation;

namespace Domain.Validators
{
    public class PostValidator : AbstractValidator<Post>
    {
        public PostValidator()
        {
            RuleFor( x => x.Title )
                .NotEmpty().WithMessage( "Заголовок поста обязателен" )
                .Length( 1, 128 ).WithMessage( "Заголовок должен быть от 1 до 128 символов" )
                .Matches( "^[a-zA-Zа-яА-Я0-9\\s\\-\\.!?,:;\\(\\)\\[\\]]+$" )
                .WithMessage( "Заголовок содержит недопустимые символы" )
                .Must( title => !string.IsNullOrWhiteSpace( title ) )
                .WithMessage( "Заголовок не может состоять только из пробелов" );

            RuleFor( x => x.Content )
                .NotEmpty().WithMessage( "Содержимое поста обязательно" )
                .Length( 4, 5000 ).WithMessage( "Содержимое должно быть от 4 до 5000 символов" );

            RuleFor( x => x.MediaContent )
                .MaximumLength( 1000 ).WithMessage( "Ссылка на медиа-контент не может превышать 1000 символов" );

            RuleFor( x => x.PostDate )
                .LessThanOrEqualTo( x => DateTime.UtcNow.AddMinutes( 1 ) )
                .WithMessage( "Дата публикации не может быть в будущем" )
                .When( x => x.PostDate != default(DateTime) );

            RuleFor( x => x.UserId )
                .GreaterThan( 0 ).WithMessage( "ID пользователя должен быть больше 0" );

            RuleFor( x => x.FandomId )
                .GreaterThan( 0 ).WithMessage( "ID фандома должен быть больше 0" );

            RuleFor( x => x.CategoryId )
                .GreaterThan( 0 ).WithMessage( "ID категории должен быть больше 0" );
        }
    }
}