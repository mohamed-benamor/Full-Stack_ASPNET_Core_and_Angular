using API.Data;
using API.Interfaces;
using API.Rules;
using API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApplicationModels;
using Microsoft.EntityFrameworkCore;

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

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseCors(options =>
  options
    .AllowAnyHeader()
    .AllowAnyMethod()
    .WithOrigins("http://localhost:4200", "https://localhost:4200")
);

app.MapControllers();

app.Run();
