using System.Text;
using API.Data;
using API.Helpers;
using API.Interfaces;
using API.Middlewares;
using API.Rules;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder
  .Services.AddControllers(options =>
    options.Conventions.Add(
      new RouteTokenTransformerConvention(new KebabCaseParameterTransformer())
    )
  )
  .AddJsonOptions(options =>
    options.JsonSerializerOptions.PropertyNamingPolicy = JsonDefaults.KebabCaseOptions
  );

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
  options.InvalidModelStateResponseFactory = context =>
  {
    var namingPolicy = JsonDefaults.KebabCaseOptions;

    var errors = context
      .ModelState.Where(error => error.Value?.Errors.Count > 0)
      .ToDictionary(
        kvp => namingPolicy.ConvertName(kvp.Key),
        kvp => kvp.Value!.Errors.Select(error => error.ErrorMessage).ToArray()
      );

    var problemDetails = new ValidationProblemDetails(errors)
    {
      Status = StatusCodes.Status400BadRequest,
      Title = "One or more validation errors occurred",
    };

    return new BadRequestObjectResult(problemDetails);
  };
});

builder.Services.AddDbContext<AppDbContext>(options =>
  options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"))
);

builder.Services.AddCors();

builder.Services.AddScoped<ITokenService, TokenService>();

builder.Services.AddScoped<IMemberRepository, MemberRepository>();

builder.Services.AddScoped<IPhotoService, PhotoService>();

builder.Services.AddScoped<ILikeRepository, LikeRepository>();

builder.Services.AddScoped<LogUserActivity>();

builder.Services.Configure<CloudinarySettings>(
  builder.Configuration.GetSection("CloudinarySettings")
);

builder
  .Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
  .AddJwtBearer(options =>
  {
    var jwtSecret =
      builder.Configuration["JwtSecret"] ?? throw new Exception("Token key not found - Globally");
    options.TokenValidationParameters = new TokenValidationParameters
    {
      ValidateIssuerSigningKey = true,
      IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
      ValidateIssuer = false,
      ValidateAudience = false,
    };
  });

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>();

app.UseCors(options =>
  options
    .AllowAnyHeader()
    .AllowAnyMethod()
    .WithOrigins("http://localhost:4200", "https://localhost:4200")
);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

try
{
  var context = services.GetRequiredService<AppDbContext>();

  await context.Database.MigrateAsync();
  await Seed.SeedUsers(context);
}
catch (Exception exception)
{
  var logger = services.GetRequiredService<ILogger<Program>>();
  logger.LogError(exception, "An error occured during migration");

  throw;
}

app.Run();
