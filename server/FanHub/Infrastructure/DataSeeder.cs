using Application.PasswordHasher;
using Domain.Entities;
using Domain.Enums;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure
{
    public class DataSeeder
    {
        private readonly FanHubDbContext _context;
        private readonly IPasswordHasher _passwordHasher;

        public DataSeeder( FanHubDbContext context, IPasswordHasher passwordHasher )
        {
            _context = context;
            _passwordHasher = passwordHasher;
        }

        public async Task SeedAsync()
        {
            await _context.Database.MigrateAsync();

            await SeedAdminUserAsync();
        }

        private async Task SeedAdminUserAsync()
        {
            if ( !await _context.Users.AnyAsync( u => u.Role == UserRole.Admin ) )
            {
                User adminUser = new User
                {
                    Username = "JohnDoe",
                    Login = "admin222",
                    PasswordHash = _passwordHasher.Hash( "admin123" ),
                    Role = UserRole.Admin,
                    RegistrationDate = DateTime.UtcNow,
                    Avatar = "7e45239d-4ad9-43c2-8b96-e24c4ac3fa32.jpg"
                };

                _context.Users.Add( adminUser );
                await _context.SaveChangesAsync();
            }
        }
    }
}