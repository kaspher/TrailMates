using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TrailMates.Infrastructure.Migrations.Users;

/// <inheritdoc />
public partial class Initial : Migration
{
    /// <inheritdoc />
    protected override void Up(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.EnsureSchema(name: "users");

        migrationBuilder.CreateTable(
            name: "Roles",
            schema: "users",
            columns: table => new
            {
                Id = table
                    .Column<int>(type: "integer", nullable: false)
                    .Annotation(
                        "Npgsql:ValueGenerationStrategy",
                        NpgsqlValueGenerationStrategy.IdentityByDefaultColumn
                    ),
                Name = table.Column<string>(
                    type: "character varying(100)",
                    maxLength: 100,
                    nullable: false
                )
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Roles", x => x.Id);
            }
        );

        migrationBuilder.CreateTable(
            name: "Users",
            schema: "users",
            columns: table => new
            {
                Id = table.Column<Guid>(type: "uuid", nullable: false),
                FirstName = table.Column<string>(
                    type: "character varying(100)",
                    maxLength: 100,
                    nullable: false
                ),
                LastName = table.Column<string>(
                    type: "character varying(100)",
                    maxLength: 100,
                    nullable: false
                ),
                Email = table.Column<string>(
                    type: "character varying(200)",
                    maxLength: 200,
                    nullable: false
                ),
                Gender = table.Column<string>(type: "text", nullable: false),
                Country = table.Column<string>(type: "text", nullable: false),
                City = table.Column<string>(type: "text", nullable: false),
                Password = table.Column<string>(type: "text", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_Users", x => x.Id);
            }
        );

        migrationBuilder.CreateTable(
            name: "UserRole",
            schema: "users",
            columns: table => new
            {
                RoleId = table.Column<int>(type: "integer", nullable: false),
                UserId = table.Column<Guid>(type: "uuid", nullable: false)
            },
            constraints: table =>
            {
                table.PrimaryKey("PK_UserRole", x => new { x.RoleId, x.UserId });
                table.ForeignKey(
                    name: "FK_UserRole_Roles_RoleId",
                    column: x => x.RoleId,
                    principalSchema: "users",
                    principalTable: "Roles",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade
                );
                table.ForeignKey(
                    name: "FK_UserRole_Users_UserId",
                    column: x => x.UserId,
                    principalSchema: "users",
                    principalTable: "Users",
                    principalColumn: "Id",
                    onDelete: ReferentialAction.Cascade
                );
            }
        );

        migrationBuilder.InsertData(
            schema: "users",
            table: "Roles",
            columns: new[] { "Id", "Name" },
            values: new object[,]
            {
                { 1, "Admin" },
                { 2, "User" },
                { 3, "Moderator" }
            }
        );

        migrationBuilder.CreateIndex(
            name: "IX_UserRole_UserId",
            schema: "users",
            table: "UserRole",
            column: "UserId"
        );
    }

    /// <inheritdoc />
    protected override void Down(MigrationBuilder migrationBuilder)
    {
        migrationBuilder.DropTable(name: "UserRole", schema: "users");

        migrationBuilder.DropTable(name: "Roles", schema: "users");

        migrationBuilder.DropTable(name: "Users", schema: "users");
    }
}
