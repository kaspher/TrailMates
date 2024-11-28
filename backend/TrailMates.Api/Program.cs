using Microsoft.EntityFrameworkCore;
using TrailMates.Api;
using TrailMates.Application;
using TrailMates.Domain;
using TrailMates.Infrastructure;
using TrailMates.Infrastructure.Common.Persistence;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddJsonFile(
    "appsettings.personal.json",
    optional: false,
    reloadOnChange: false
);

builder
    .Services.AddCore()
    .AddApplication()
    .AddInfrastructure(builder.Configuration)
    .AddPresentation(builder.Configuration)
    .AddCors(options =>
    {
        options.AddPolicy(
            "AllowSpecificOrigin",
            corsPolicyBuilder =>
                corsPolicyBuilder
                    .WithOrigins("http://localhost:3000")
                    .AllowAnyHeader()
                    .AllowAnyMethod()
        );
    });

var app = builder.Build();
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "TrailMates API V1");
        options.RoutePrefix = string.Empty;
    });
    //
    // using var serviceScope = app.Services.CreateScope();
    // using var dbContext = serviceScope.ServiceProvider.GetService<UsersDbContext>();
    // dbContext?.Database.MigrateAsync();
}

app.UseInfrastructure().UseApplication().UsePresentation().UseCors("AllowSpecificOrigin");
app.Run();
