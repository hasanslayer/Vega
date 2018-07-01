using Microsoft.EntityFrameworkCore.Migrations;

namespace Vega.Migrations
{
    public partial class EditVehicle : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IdRegistered",
                table: "Vehicles",
                newName: "IsRegistered");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "IsRegistered",
                table: "Vehicles",
                newName: "IdRegistered");
        }
    }
}
