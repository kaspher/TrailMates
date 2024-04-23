using Microsoft.Extensions.Options;
using TrailMates.Application;
using TrailMates.Core;
using TrailMates.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddCore()
    .AddApplication()
    .AddInfrastructure(builder.Configuration)
    .AddCors(options =>
    {
        options.AddPolicy("AllowSpecificOrigin",
            corsPolicyBuilder => corsPolicyBuilder.WithOrigins("http://localhost:3000")
                .AllowAnyHeader()
                .AllowAnyMethod());
    });

var app = builder.Build();
app.UseInfrastructure();
app.UseCors("AllowSpecificOrigin");
app.MapGet("api", (IOptions<AppOptions> options) => Results.Ok(options.Value.Name));
app.Run();