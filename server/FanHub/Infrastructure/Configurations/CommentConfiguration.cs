using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations
{
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
                .IsRequired();

            builder.Property( c => c.CommentDate )
                .IsRequired();

            builder.HasOne( c => c.Post )
                .WithMany()
                .HasForeignKey( c => c.PostId );

            builder.HasOne( c => c.User )
                .WithMany()
                .HasForeignKey( c => c.UserId );
        }
    }
}