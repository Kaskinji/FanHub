using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations
{
    public class GameConfiguration : IEntityTypeConfiguration<Game>
    {
        public void Configure( EntityTypeBuilder<Game> builder )
        {
            builder.HasKey( g => g.Id );

            builder.Property( g => g.Title )
                .IsRequired()
                .HasMaxLength( 256 );

            builder.Property( g => g.Description )
                .IsRequired();

            builder.Property( g => g.ReleaseDate )
                .IsRequired();

            builder.Property( g => g.Developer )
                .IsRequired()
                .HasMaxLength( 128 );

            builder.Property( g => g.Publisher )
                .IsRequired()
                .HasMaxLength( 128 );

            builder.Property( g => g.CoverImage )
                .IsRequired()
                .HasMaxLength( 1000 );

            builder.Property( g => g.Genre )
                .IsRequired()
                .HasMaxLength( 128 );

            builder.HasMany( g => g.Fandoms )
                   .WithOne( f => f.Game )
                   .HasForeignKey( f => f.GameId );

            builder.HasIndex( g => g.Title );
            builder.HasIndex( g => g.Genre );
        }
    }
}