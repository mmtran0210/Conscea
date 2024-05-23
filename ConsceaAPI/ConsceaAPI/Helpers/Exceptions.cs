using Microsoft.AspNetCore.Mvc;
using System.Net;

namespace ConsceaAPI.Helpers;

public abstract class ExceptionWithResponse : Exception
{
    public abstract string Description { get; }

    public abstract string Title { get; }

    public abstract HttpStatusCode StatusCode { get; }

    public ProblemDetails GetProblemDetails()
    {
        return new()
        {
            Title = Title,
            Detail = Description,
            Status = (int)StatusCode,
        };
    }
}

public class NotFoundException : ExceptionWithResponse
{
    public override string Description { get; } = "Not Found";

    public override string Title { get; } = "The resource was not found";

    public override HttpStatusCode StatusCode { get; } = HttpStatusCode.NotFound;

    public NotFoundException()
    {
    }

    public NotFoundException(string title, string description)
    {
        Title = title;
        Description = description;
    }
}

public class ConflictException : ExceptionWithResponse
{
    public override string Description { get; } = "Conflict exception";

    public override string Title { get; } = "Conflict exception";

    public override HttpStatusCode StatusCode { get; } = HttpStatusCode.Conflict;

    public ConflictException()
    {
    }

    public ConflictException(string description)
    {
        Description = description;
    }
}

public class ForbidException : ExceptionWithResponse
{
    public override string Description { get; } = "Forbid exception";

    public override string Title { get; } = "Forbid exception";

    public override HttpStatusCode StatusCode { get; } = HttpStatusCode.Forbidden;

    public ForbidException()
    {
    }

    public ForbidException(string description)
    {
        Description = description;
    }
}

public class BadRequestException : ExceptionWithResponse
{
    public override string Description { get; } = "Bad request exception";

    public override string Title { get; } = "Bad request exception";

    public override HttpStatusCode StatusCode { get; } = HttpStatusCode.BadRequest;

    public BadRequestException()
    {
    }

    public BadRequestException(string description)
    {
        Description = description;
    }
}

public class UnprocessableException : ExceptionWithResponse
{
    public override string Description { get; } = "The request was unprocessable.";

    public override string Title { get; } = "Unprocessable request";

    public override HttpStatusCode StatusCode { get; } = HttpStatusCode.UnprocessableEntity;

    public UnprocessableException()
    {
    }

    public UnprocessableException(string description)
    {
        Description = description;
    }
}

public class ServerError : ExceptionWithResponse
{
    public override string Description { get; } = "Conflict exception";

    public override string Title { get; } = "Conflict exception";

    public override HttpStatusCode StatusCode { get; } = HttpStatusCode.InternalServerError;

    public ServerError()
    {
    }

    public ServerError(string description)
    {
        Description = description;
    }
}
