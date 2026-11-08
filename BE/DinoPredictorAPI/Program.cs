var builder = WebApplication.CreateBuilder(args);

builder.AddUploadLimits();
builder.Services.AddControllers().AddODataApi();
builder.Services.AddOpenApi();
builder.Services.AddPersistence(builder.Configuration, builder.Environment);
builder.Services.AddInference();
builder.Services.AddErrorHandling();
builder.Services.AddRequestLanguages();
builder.Services.AddFrontendCors(builder.Configuration);
builder.Services.AddImageStorage();
builder.Services.AddScoped<IPredictionsService, PredictionsService>();

var app = builder.Build();

app.UseCors();
app.UseExceptionHandler();
app.MapControllers();
app.MigrateDatabase();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options => options.SwaggerEndpoint("/openapi/v1.json", "DinoPredictorAPI"));
}

app.MapHealthChecks("/health");

app.Run();
