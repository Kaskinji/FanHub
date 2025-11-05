using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations
{
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

            builder.Property( p => p.Status )
                .IsRequired()
                .HasConversion<byte>();

            //builder.HasOne( p => p.User )
            //    .WithMany()
            //    .HasForeignKey( p => p.UserId );

            //builder.HasOne( p => p.Fandom )
            //    .WithMany()
            //    .HasForeignKey( p => p.FandomId );

            //builder.HasOne( p => p.Category )
            //    .WithMany()
            //    .HasForeignKey( p => p.CategoryId );
        }
    }
}
