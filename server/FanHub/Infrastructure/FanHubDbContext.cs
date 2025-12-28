using Application.PasswordHasher;
using Domain.Entities;
using Domain.Enums;
using Infrastructure.Configurations;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure;

public class FanHubDbContext : DbContext
{
    public FanHubDbContext( DbContextOptions<FanHubDbContext> options, IPasswordHasher hasher )
        : base( options )
    {
        _hasher = hasher;
    }

    private IPasswordHasher _hasher;

    public DbSet<User> Users { get; set; }
    public DbSet<Game> Games { get; set; }
    public DbSet<Fandom> Fandoms { get; set; }
    public DbSet<Post> Posts { get; set; }
    public DbSet<Event> Events { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<Reaction> Reactions { get; set; }
    public DbSet<Subscription> Subscriptions { get; set; }
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<Category> Categories { get; set; }

    protected override void OnModelCreating( ModelBuilder modelBuilder )
    {
        base.OnModelCreating( modelBuilder );

        modelBuilder.ApplyConfiguration( new UserConfiguration() );
        modelBuilder.ApplyConfiguration( new GameConfiguration() );
        modelBuilder.ApplyConfiguration( new FandomConfiguration() );
        modelBuilder.ApplyConfiguration( new PostConfiguration() );
        modelBuilder.ApplyConfiguration( new EventConfiguration() );
        modelBuilder.ApplyConfiguration( new CommentConfiguration() );
        modelBuilder.ApplyConfiguration( new ReactionConfiguration() );
        modelBuilder.ApplyConfiguration( new SubscriptionConfiguration() );
        modelBuilder.ApplyConfiguration( new NotificationConfiguration() );
        modelBuilder.ApplyConfiguration( new CategoryConfiguration() );
    }

    public void Seed()
    {
        if ( !Users.Any( u => u.Role == UserRole.Admin ) )
        {
            Users.Add( new User
            {
                Username = "admin",
                Login = "admin222",
                PasswordHash = _hasher.Hash( "admin123" ),
                Role = UserRole.Admin,
                RegistrationDate = DateTime.UtcNow
            } );

            SaveChanges();
        }
    }
}