using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddNotifications : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Notifications");

            migrationBuilder.CreateTable(
                name: "FandomNotification",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    FandomId = table.Column<int>(type: "int", nullable: false),
                    NotifierId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Type = table.Column<byte>(type: "tinyint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FandomNotification", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FandomNotification_Fandoms_FandomId",
                        column: x => x.FandomId,
                        principalTable: "Fandoms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "NotificationViews",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NotificationId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    ViewedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsHidden = table.Column<bool>(type: "bit", nullable: false, defaultValue: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NotificationViews", x => x.Id);
                    table.ForeignKey(
                        name: "FK_NotificationViews_FandomNotification_NotificationId",
                        column: x => x.NotificationId,
                        principalTable: "FandomNotification",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_NotificationViews_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FandomNotifications_CreatedAt",
                table: "FandomNotification",
                column: "CreatedAt");

            migrationBuilder.CreateIndex(
                name: "IX_FandomNotifications_FandomId",
                table: "FandomNotification",
                column: "FandomId");

            migrationBuilder.CreateIndex(
                name: "IX_FandomNotifications_FandomId_CreatedAt",
                table: "FandomNotification",
                columns: new[] { "FandomId", "CreatedAt" },
                descending: new[] { false, true });

            migrationBuilder.CreateIndex(
                name: "IX_FandomNotifications_NotifierId",
                table: "FandomNotification",
                column: "NotifierId");

            migrationBuilder.CreateIndex(
                name: "IX_NotificationViews_IsHidden",
                table: "NotificationViews",
                column: "IsHidden");

            migrationBuilder.CreateIndex(
                name: "IX_NotificationViews_NotificationId",
                table: "NotificationViews",
                column: "NotificationId");

            migrationBuilder.CreateIndex(
                name: "IX_NotificationViews_NotificationId_UserId",
                table: "NotificationViews",
                columns: new[] { "NotificationId", "UserId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_NotificationViews_UserId",
                table: "NotificationViews",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_NotificationViews_ViewedAt",
                table: "NotificationViews",
                column: "ViewedAt");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "NotificationViews");

            migrationBuilder.DropTable(
                name: "FandomNotification");

            migrationBuilder.CreateTable(
                name: "Notifications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    EventId = table.Column<int>(type: "int", nullable: true),
                    PostId = table.Column<int>(type: "int", nullable: true),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    Content = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notifications", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Notifications_Events_EventId",
                        column: x => x.EventId,
                        principalTable: "Events",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Notifications_Posts_PostId",
                        column: x => x.PostId,
                        principalTable: "Posts",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Notifications_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_EventId",
                table: "Notifications",
                column: "EventId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_PostId",
                table: "Notifications",
                column: "PostId");

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_UserId",
                table: "Notifications",
                column: "UserId");
        }
    }
}
