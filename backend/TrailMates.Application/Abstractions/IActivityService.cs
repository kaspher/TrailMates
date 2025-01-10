using CSharpFunctionalExtensions;
using Microsoft.AspNetCore.Http;
using TrailMates.Domain.Errors;

namespace TrailMates.Application.Abstractions;

public interface IActivityService
{
    Task<Result<string, Error>> CreateS3BucketFolder(string activityId);
    Task<Result<List<string>, Error>> AddActivityPictures(
        string activityId,
        List<IFormFile> pictures
    );
}
