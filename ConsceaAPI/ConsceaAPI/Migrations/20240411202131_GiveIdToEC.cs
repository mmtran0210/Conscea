using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace ConsceaAPI.Migrations
{
    /// <inheritdoc />
    public partial class GiveIdToEC : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_EmployeeCertificates",
                table: "EmployeeCertificates");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "EmployeeCertificates",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AddPrimaryKey(
                name: "PK_EmployeeCertificates",
                table: "EmployeeCertificates",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_EmployeeCertificates_EmployeeID",
                table: "EmployeeCertificates",
                column: "EmployeeID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_EmployeeCertificates",
                table: "EmployeeCertificates");

            migrationBuilder.DropIndex(
                name: "IX_EmployeeCertificates_EmployeeID",
                table: "EmployeeCertificates");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "EmployeeCertificates");

            migrationBuilder.AddPrimaryKey(
                name: "PK_EmployeeCertificates",
                table: "EmployeeCertificates",
                columns: new[] { "EmployeeID", "CertificateID" });
        }
    }
}
