using Domain.Entities;
using FluentValidation;

namespace Domain.Validators
{
    public class FandomValidator : AbstractValidator<Fandom>
    {
        public FandomValidator()
        {
            RuleFor( x => x.Name )
                .NotEmpty().WithMessage( "Название фандома обязательно" )
                .Length( 3, 128 ).WithMessage( "Название должно быть от 3 до 128 символов" )
                .Matches( "^[a-zA-Zа-яА-Я0-9\\s\\-!&]+$" ).WithMessage( "Название может содержать только буквы, цифры, пробелы, дефисы, амперсанды и восклицательные знаки" )
                .Must( name => !string.IsNullOrWhiteSpace( name ) ).WithMessage( "Название не может состоять только из пробелов" )
                .Must( name => !name.Contains( "  " ) ).WithMessage( "Название не может содержать двойные пробелы" );

            RuleFor( x => x.Description )
                .NotEmpty().WithMessage( "Описание фандома обязательно" )
                .Length( 5, 2000 ).WithMessage( "Описание должно быть от 5 до 2000 символов" )
                .Must( desc => !string.IsNullOrWhiteSpace( desc ) ).WithMessage( "Описание не может состоять только из пробелов" );

            RuleFor( x => x.Rules )
                .NotEmpty().WithMessage( "Правила фандома обязательны" )
                .Length( 5, 5000 ).WithMessage( "Правила должны быть от 5 до 5000 символов" )
                .Must( rules => !string.IsNullOrWhiteSpace( rules ) ).WithMessage( "Правила не могут состоять только из пробелов" );

            RuleFor( x => x.CoverImage )
                .MaximumLength( 1000 ).WithMessage( "Ссылка на картинку слишком длинная" );

            RuleFor( x => x.GameId )
                .GreaterThan( 0 ).WithMessage( "ID игры должен быть положительным числом" );

            RuleFor( x => x.CreationDate )
                .GreaterThanOrEqualTo( new DateTime( 2000, 1, 1, 0, 0, 0, DateTimeKind.Utc ) ).WithMessage( "Дата создания не может быть раньше 2000 года" )
                .When( x => x.CreationDate != default );
        }
    }
}