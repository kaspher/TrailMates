using System.Net;
using CSharpFunctionalExtensions;
using Microsoft.AspNetCore.Http;
using IResult = Microsoft.AspNetCore.Http.IResult;

namespace TrailMates.Domain.Errors;

public static class ErrorsExtensions
{
    public static IResult ToErrorProblemResult(this Error error) =>
        error.Reason switch
        {
            ValidationErrorReason err
                => Results.ValidationProblem(err.ValidationErrors, title: err.Message),
            BadRequestReason err
                => Results.Problem(
                    detail: err.Description,
                    statusCode: (int)HttpStatusCode.BadRequest,
                    title: err.Message
                ),
            NotFoundReason err
                => Results.Problem(
                    detail: err.Message,
                    statusCode: (int)HttpStatusCode.NotFound,
                    title: "Not found"
                ),
            FailureReason err
                => Results.Problem(
                    detail: err.Message,
                    statusCode: (int)HttpStatusCode.InternalServerError,
                    title: "Request failure"
                ),
            _ => throw new ArgumentOutOfRangeException()
        };

    public static UnitResult<Error> ToInputValidationResult(
        this FluentValidation.Results.ValidationResult validationResults,
        string title = "input data validation error"
    ) =>
        validationResults.IsValid
            ? UnitResult.Success<Error>()
            : UnitResult.Failure(Errors.Validation(title, validationResults.ToDictionary()));
}
