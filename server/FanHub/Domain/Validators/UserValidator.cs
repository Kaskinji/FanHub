using Domain.Entities;
using Domain.Enums;
using FluentValidation;
using System.Text.RegularExpressions;

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
                .NotEmpty().WithMessage( "Пароль обязателен" )
                .MinimumLength( 8 ).WithMessage( "Пароль должен быть не менее 8 символов" )
                .MaximumLength( 256 ).WithMessage( "Пароль слишком длинный" )
                .Must( BeStrongPassword ).WithMessage( "Пароль должен содержать минимум 1 заглавную букву, 1 цифру и 1 специальный символ" );

            RuleFor( x => x.Avatar )
                .MaximumLength( 1000 ).WithMessage( "URL аватара не может превышать 500 символов" )
                .Must( UrlValidator.ValidateImageUrl ).WithMessage( "Некорректный URL аватара" );

            RuleFor( x => x.RegistrationDate )
                .LessThanOrEqualTo( DateTime.UtcNow ).WithMessage( "Дата регистрации не может быть в будущем" )
                .GreaterThanOrEqualTo( new DateTime( 2020, 1, 1 ) ).WithMessage( "Дата регистрации некорректна" );

            RuleFor( x => x.Role )
                .IsInEnum().WithMessage( "Некорректная роль пользователя" )
                .Must( role => role != UserRole.Admin ).WithMessage( "Нельзя напрямую устанавливать роль Admin" );
        }

        private bool BeStrongPassword( string password )
        {
            if ( string.IsNullOrEmpty( password ) )
            {
                return false;
            }

            Regex hasUpperCase = new Regex( @"[A-Z]" );
            Regex hasLowerCase = new Regex( @"[a-z]" );
            Regex hasDigit = new Regex( @"[0-9]" );
            Regex hasSpecialChar = new Regex( @"[!@#$%^&*()_+\-=\[\]{};':""\\|,.<>\/?]" );

            return hasUpperCase.IsMatch( password ) &&
                   hasLowerCase.IsMatch( password ) &&
                   hasDigit.IsMatch( password ) &&
                   hasSpecialChar.IsMatch( password );
        }
    }
}