using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class FandomConfiguration : IEntityTypeConfiguration<Fandom>
{
    public void Configure( EntityTypeBuilder<Fandom> builder )
    {
        builder.HasKey( f => f.Id );

        builder.Property( f => f.GameId )
            .IsRequired();

        builder.Property( f => f.Name )
            .IsRequired()
            .HasMaxLength( 128 );

        builder.Property( f => f.Description )
            .IsRequired();

        builder.Property( f => f.CreationDate )
            .IsRequired();

        builder.Property( f => f.Rules )
            .IsRequired();

        builder.HasMany( f => f.Events )
            .WithOne( e => e.Fandom )
            .HasForeignKey( e => e.FandomId )
            .OnDelete( DeleteBehavior.Cascade );

        builder.HasMany( f => f.Subscriptions )
            .WithOne( s => s.Fandom )
            .HasForeignKey( s => s.FandomId )
            .OnDelete( DeleteBehavior.Cascade );

        builder.HasIndex( f => f.GameId );
        builder.HasIndex( f => f.Name );
        builder.HasIndex( f => f.CreationDate );

        builder.HasIndex( f => new { f.GameId, f.Name } )
            .IsUnique();
    }
}