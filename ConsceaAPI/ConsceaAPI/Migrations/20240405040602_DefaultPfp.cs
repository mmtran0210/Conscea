using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ConsceaAPI.Migrations
{
    /// <inheritdoc />
    public partial class DefaultPfp : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "PfpUrl",
                table: "Employees",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "https://i.stack.imgur.com/34AD2.jpg",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "PfpUrl",
                table: "Employees",
                type: "nvarchar(max)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldDefaultValue: "https://i.stack.imgur.com/34AD2.jpg");
        }
    }
}
