using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCreatorToFandom : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Fandoms_Games_GameId",
                table: "Fandoms");

            migrationBuilder.AddColumn<int>(
                name: "CreatorId",
                table: "Fandoms",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Fandoms_CreatorId",
                table: "Fandoms",
                column: "CreatorId");

            migrationBuilder.AddForeignKey(
                name: "FK_Fandoms_Games_GameId",
                table: "Fandoms",
                column: "GameId",
                principalTable: "Games",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Fandoms_Users_CreatorId",
                table: "Fandoms",
                column: "CreatorId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Fandoms_Games_GameId",
                table: "Fandoms");

            migrationBuilder.DropForeignKey(
                name: "FK_Fandoms_Users_CreatorId",
                table: "Fandoms");

            migrationBuilder.DropIndex(
                name: "IX_Fandoms_CreatorId",
                table: "Fandoms");

            migrationBuilder.DropColumn(
                name: "CreatorId",
                table: "Fandoms");

            migrationBuilder.AddForeignKey(
                name: "FK_Fandoms_Games_GameId",
                table: "Fandoms",
                column: "GameId",
                principalTable: "Games",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
