using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations
{
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

            builder.HasOne( f => f.Game )
                .WithMany()
                .HasForeignKey( f => f.GameId );
        }
    }
}