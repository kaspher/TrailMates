namespace TrailMates.Domain.Errors;

public static class Errors
{
    public static Error Failure(string message, Exception? cause = null) =>
        Error.Create(new FailureReason(message, cause));

    public static Error Validation(
        string message,
        IDictionary<string, string[]> validationErrors
    ) => Error.Create(new ValidationErrorReason(message, validationErrors));

    public static Error BadRequest(string message, string? description = null) =>
        Error.Create(new BadRequestReason(message, description));

    public static Error NotFound(string message) => Error.Create(new NotFoundReason(message));
}
