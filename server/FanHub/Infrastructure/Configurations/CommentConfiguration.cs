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
                .IsRequired()
                .HasMaxLength( 2000 );

            builder.Property( c => c.CommentDate )
                .IsRequired();
        }
    }
}