using ConsceaAPI.Data;
using ConsceaAPI.Helpers;
using ConsceaAPI.Interfaces;
using ConsceaAPI.Services;
using Microsoft.EntityFrameworkCore;
using static ConsceaAPI.Helpers.Constants;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// Load Environment variables into config
DotNetEnv.Env.TraversePath().Load();
builder.Configuration.AddEnvironmentVariables();

if (builder.Configuration[ConfigKey.ConnectionString] is null)
{
    throw new Exception($"Database connection string is not configured. Missing {ConfigKey.ConnectionString}. See README for adding.");
}

if (builder.Configuration[ConfigKey.AvatarContainerName] is null)
{
    throw new Exception($"Avatar container name is not configured. Missing {ConfigKey.AvatarContainerName}. See README for adding.");
}

if (builder.Configuration[ConfigKey.StorageConnectionString] is null)
{
    throw new Exception($"Storage connection string is not configured. Missing {ConfigKey.StorageConnectionString}. See README for adding.");
}

if (builder.Configuration[ConfigKey.ServiceBusConnectionString] is null)
{
    throw new Exception($"Service Bus connection string is not configured. Missing {ConfigKey.ServiceBusConnectionString}. See README for adding.");
}

var connectionString = builder.Configuration[ConfigKey.ConnectionString];


builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(connectionString);
});


builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IStorageService, AzureBlobStorageService>();
builder.Services.AddScoped<MessageSenderService>();

var app = builder.Build();

app.UseExceptionHandler(new ExceptionHandlerOptions { ExceptionHandler = ExceptionHandler.HandleException });

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(x => x
        .WithOrigins("http://localhost:5173")
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials());

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
