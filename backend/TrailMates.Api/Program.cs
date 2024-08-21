using TrailMates.Api;
using TrailMates.Application;
using TrailMates.Domain;
using TrailMates.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder
    .Services.AddCore()
    .AddApplication()
    .AddInfrastructure(builder.Configuration)
    .AddPresentation()
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

app.UseInfrastructure().UseApplication().UsePresentation();
app.UseCors("AllowSpecificOrigin");

app.Run();
