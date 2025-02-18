﻿using Microsoft.AspNetCore.Diagnostics;

namespace ConsceaAPI.Helpers;

public static class ExceptionHandler
{
    public static async Task HandleException(HttpContext context)
    {
        var exceptionHandlerPathFeature = context.Features.Get<IExceptionHandlerPathFeature>();
        var error = exceptionHandlerPathFeature?.Error;

        if (error is ExceptionWithResponse exception)
        {
            context.Response.StatusCode = (int)exception.StatusCode;
            await context.Response.WriteAsJsonAsync(exception.GetProblemDetails());
        }
    }
}
