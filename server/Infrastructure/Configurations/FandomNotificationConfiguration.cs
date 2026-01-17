using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class FandomNotificationConfiguration : IEntityTypeConfiguration<FandomNotification>
{
    public void Configure( EntityTypeBuilder<FandomNotification> builder )
    {
        builder.ToTable( "FandomNotification" );

        builder.HasKey( x => x.Id );

        builder.Property( x => x.Id )
            .ValueGeneratedOnAdd();

        builder.Property( x => x.FandomId )
            .IsRequired();

        builder.Property( x => x.NotifierId )
            .IsRequired();

        builder.Property( x => x.CreatedAt )
            .IsRequired();

        builder.Property( x => x.Type )
            .IsRequired()
            .HasConversion<byte>();

        builder.HasOne( x => x.Fandom )
            .WithMany( f => f.Notifications )
            .HasForeignKey( x => x.FandomId );

        builder.HasIndex( x => x.FandomId )
            .HasDatabaseName( "IX_FandomNotifications_FandomId" );

        builder.HasIndex( x => x.NotifierId )
            .HasDatabaseName( "IX_FandomNotifications_NotifierId" );

        builder.HasIndex( x => x.CreatedAt )
            .HasDatabaseName( "IX_FandomNotifications_CreatedAt" );

        builder.HasIndex( x => new { x.FandomId, x.CreatedAt } )
            .HasDatabaseName( "IX_FandomNotifications_FandomId_CreatedAt" )
            .IsDescending( false, true );
    }
}