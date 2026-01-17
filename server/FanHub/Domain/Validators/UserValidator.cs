using Domain.Entities;
using FluentValidation;

namespace Domain.Validators
{
    public class UserValidator : AbstractValidator<User>
    {
        public UserValidator()
        {
            RuleFor( x => x.Id )
                .GreaterThanOrEqualTo( 0 ).WithMessage( "ID пользователя должен быть неотрицательным" );

            RuleFor( x => x.Username )
                .NotEmpty().WithMessage( "Имя пользователя обязательно" )
                .Length( 3, 128 ).WithMessage( "Имя пользователя должно быть от 3 до 128 символов" )
                .Matches( "^[a-zA-Z0-9_]+$" ).WithMessage( "Имя пользователя может содержать только буквы, цифры и подчеркивания" )
                .Must( username => !username.All( char.IsDigit ) ).WithMessage( "Имя пользователя не может состоять только из цифр" );

            RuleFor( x => x.Login )
                .NotEmpty().WithMessage( "Логин обязателен" )
                .MaximumLength( 256 ).WithMessage( "Логин не может превышать 256 символов" )
                .Matches( "^[a-zA-Z0-9_]+$" ).WithMessage( "Логин может содержать только буквы, цифры и подчеркивания" );

            RuleFor( x => x.PasswordHash )
                .NotEmpty().WithMessage( "Пароль обязателен" );

            RuleFor( x => x.Avatar )
                .MaximumLength( 1000 ).WithMessage( "URL аватара не может превышать 1000 символов" )
                .MinimumLength( 10 )
                .Unless( x => x.Avatar is null );
        }
    }
}