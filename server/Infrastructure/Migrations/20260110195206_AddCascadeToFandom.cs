using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCascadeToFandom : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Events_Fandoms_FandomId",
                table: "Events");

            migrationBuilder.DropForeignKey(
                name: "FK_FandomNotification_Fandoms_FandomId",
                table: "FandomNotification");

            migrationBuilder.DropForeignKey(
                name: "FK_NotificationViews_FandomNotification_NotificationId",
                table: "NotificationViews");

            migrationBuilder.DropForeignKey(
                name: "FK_Posts_Fandoms_FandomId",
                table: "Posts");

            migrationBuilder.DropForeignKey(
                name: "FK_Subscriptions_Fandoms_FandomId",
                table: "Subscriptions");

            migrationBuilder.AddForeignKey(
                name: "FK_Events_Fandoms_FandomId",
                table: "Events",
                column: "FandomId",
                principalTable: "Fandoms",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_FandomNotification_Fandoms_FandomId",
                table: "FandomNotification",
                column: "FandomId",
                principalTable: "Fandoms",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_NotificationViews_FandomNotification_NotificationId",
                table: "NotificationViews",
                column: "NotificationId",
                principalTable: "FandomNotification",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Posts_Fandoms_FandomId",
                table: "Posts",
                column: "FandomId",
                principalTable: "Fandoms",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Subscriptions_Fandoms_FandomId",
                table: "Subscriptions",
                column: "FandomId",
                principalTable: "Fandoms",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Events_Fandoms_FandomId",
                table: "Events");

            migrationBuilder.DropForeignKey(
                name: "FK_FandomNotification_Fandoms_FandomId",
                table: "FandomNotification");

            migrationBuilder.DropForeignKey(
                name: "FK_NotificationViews_FandomNotification_NotificationId",
                table: "NotificationViews");

            migrationBuilder.DropForeignKey(
                name: "FK_Posts_Fandoms_FandomId",
                table: "Posts");

            migrationBuilder.DropForeignKey(
                name: "FK_Subscriptions_Fandoms_FandomId",
                table: "Subscriptions");

            migrationBuilder.AddForeignKey(
                name: "FK_Events_Fandoms_FandomId",
                table: "Events",
                column: "FandomId",
                principalTable: "Fandoms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_FandomNotification_Fandoms_FandomId",
                table: "FandomNotification",
                column: "FandomId",
                principalTable: "Fandoms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_NotificationViews_FandomNotification_NotificationId",
                table: "NotificationViews",
                column: "NotificationId",
                principalTable: "FandomNotification",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Posts_Fandoms_FandomId",
                table: "Posts",
                column: "FandomId",
                principalTable: "Fandoms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Subscriptions_Fandoms_FandomId",
                table: "Subscriptions",
                column: "FandomId",
                principalTable: "Fandoms",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
