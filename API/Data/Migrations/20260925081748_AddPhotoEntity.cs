using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace API.Data.Migrations
{
  /// <inheritdoc />
  public partial class AddPhotoEntity : Migration
  {
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.CreateTable(
        name: "Photos",
        columns: table => new
        {
          Id = table
            .Column<int>(type: "INTEGER", nullable: false)
            .Annotation("Sqlite:Autoincrement", true),
          Url = table.Column<string>(type: "TEXT", nullable: false),
          PublicId = table.Column<string>(type: "TEXT", nullable: true),
          MemberId = table.Column<string>(type: "TEXT", nullable: false),
        },
        constraints: table =>
        {
          table.PrimaryKey("PK_Photos", x => x.Id);
          table.ForeignKey(
            name: "FK_Photos_Members_MemberId",
            column: x => x.MemberId,
            principalTable: "Members",
            principalColumn: "Id",
            onDelete: ReferentialAction.Cascade
          );
        }
      );

      migrationBuilder.CreateIndex(name: "IX_Photos_MemberId", table: "Photos", column: "MemberId");
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
      migrationBuilder.DropTable(name: "Photos");
    }
  }
}
