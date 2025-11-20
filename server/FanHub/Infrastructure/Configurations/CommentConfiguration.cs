using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class CommentConfiguration : IEntityTypeConfiguration<Comment>
{
    public void Configure( EntityTypeBuilder<Comment> builder )
    {
        builder.HasKey( c => c.Id );

        builder.Property( c => c.PostId )
            .IsRequired();

        builder.Property( c => c.UserId )
            .IsRequired();

        builder.Property( c => c.Content )
            .IsRequired()
            .HasMaxLength( 2000 );

        builder.Property( c => c.CommentDate )
            .IsRequired();

        builder.HasOne( c => c.User )
            .WithMany( u => u.Comments )
            .HasForeignKey( c => c.UserId )
            .OnDelete( DeleteBehavior.Cascade );

        builder.HasOne( c => c.Post )
            .WithMany( p => p.Comments )
            .HasForeignKey( c => c.PostId )
            .OnDelete( DeleteBehavior.Cascade );

        builder.HasIndex( c => c.PostId );
        builder.HasIndex( c => c.UserId );
        builder.HasIndex( c => c.CommentDate );
    }
}