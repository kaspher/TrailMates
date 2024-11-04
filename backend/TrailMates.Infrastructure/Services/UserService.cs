using Amazon.S3;
using Amazon.S3.Model;
using CSharpFunctionalExtensions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using TrailMates.Application.Abstractions;
using TrailMates.Domain.Errors;

namespace TrailMates.Infrastructure.Services;

public class UserService(IAmazonS3 s3Client, IConfiguration configuration) : IUserService
{
    public async Task<Result<string, Error>> AddOrUpdateUserProfilePicture(
        string userId,
        IFormFile picture
    )
    {
        await using var imageStream = picture.OpenReadStream();
        var putRequest = new PutObjectRequest
        {
            BucketName = configuration["AWSCustom:BucketName"],
            Key = userId,
            InputStream = imageStream,
            ContentType = "image/jpeg",
            Headers = { CacheControl = "max-age=0" }
        };
        await s3Client.PutObjectAsync(putRequest);

        return $"{configuration["AWSCustom:CloudfrontUrl"]}/{userId}";
    }
}
