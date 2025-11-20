using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class PostConfiguration : IEntityTypeConfiguration<Post>
{
    public void Configure( EntityTypeBuilder<Post> builder )
    {
        builder.HasKey( p => p.Id );

        builder.Property( p => p.UserId )
            .IsRequired();

        builder.Property( p => p.FandomId )
            .IsRequired();

        builder.Property( p => p.CategoryId )
            .IsRequired();

        builder.Property( p => p.Title )
            .IsRequired()
            .HasMaxLength( 128 );

        builder.Property( p => p.Content )
            .IsRequired()
            .HasMaxLength( 5000 );

        builder.Property( p => p.PostDate )
            .IsRequired();

        builder.Property( p => p.MediaContent )
            .HasMaxLength( 1000 );

        builder.HasOne( p => p.User )
            .WithMany( u => u.Posts )
            .HasForeignKey( p => p.UserId )
            .OnDelete( DeleteBehavior.Restrict );

        builder.HasOne( p => p.Fandom )
            .WithMany( f => f.Posts )
            .HasForeignKey( p => p.FandomId )
            .OnDelete( DeleteBehavior.Restrict );

        builder.HasOne( p => p.Category )
            .WithMany( c => c.Posts )
            .HasForeignKey( p => p.CategoryId )
            .OnDelete( DeleteBehavior.Restrict );

        builder.HasMany( p => p.Comments )
            .WithOne( c => c.Post )
            .HasForeignKey( c => c.PostId )
            .OnDelete( DeleteBehavior.Cascade );

        builder.HasMany( p => p.Reactions )
            .WithOne( c => c.Post )
            .HasForeignKey( c => c.PostId )
            .OnDelete( DeleteBehavior.Cascade );

        builder.HasIndex( p => p.UserId );
        builder.HasIndex( p => p.FandomId );
        builder.HasIndex( p => p.CategoryId );
        builder.HasIndex( p => p.PostDate );
        builder.HasIndex( p => new { p.FandomId, p.PostDate } );
    }
}