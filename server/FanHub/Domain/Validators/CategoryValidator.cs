using Domain.Entities;
using FluentValidation;

namespace Domain.Validators
{
    public class CategoryValidator : AbstractValidator<Category>
    {
        public CategoryValidator()
        {

            RuleFor( x => x.Name )
                .NotEmpty().WithMessage( "Название категории обязательно" )
                .Length( 2, 128 ).WithMessage( "Название должно быть от 2 до 128 символов" )
                .Matches( "^[a-zA-Zа-яА-Я0-9\\s\\-\\.]+$" ).WithMessage( "Название может содержать только буквы, цифры, пробелы, дефисы и точки" )
                .Must( name => !string.IsNullOrWhiteSpace( name ) ).WithMessage( "Название не может состоять только из пробелов" );


            RuleFor( x => x.Icon )
                .NotEmpty().WithMessage( "Иконка категории обязательна" )
                .MaximumLength( 1000 ).WithMessage( "Путь к иконке не может превышать 1000 символов" )
                //.Must( UrlValidator.ValidateImageUrl ).WithMessage( "Некорректный путь к иконке" )
                .When( x => !string.IsNullOrEmpty( x.Icon ) );
        }
    }
}