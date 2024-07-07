namespace TrailMates.Core.Errors;

public record Error(ErrorReason Reason)
{
    public static Error Create(ErrorReason reason) => new(reason);

    public Error WithPrefix(string prefix) => new(Reason.WithPrefix(prefix));
}

public record ErrorReason(string Message)
{
    public ErrorReason WithPrefix(string prefix) => new(Message: $"{prefix}: {Message}");
}

public record FailureReason(string Message, Exception? Cause = null) : ErrorReason(Message);

public record BadRequestReason(string Message, string? Description = null) : ErrorReason(Message);

public record ValidationErrorReason(string Message, IDictionary<string, string[]> ValidationErrors)
    : ErrorReason(Message);

public record NotFoundReason(string Message) : ErrorReason(Message);
