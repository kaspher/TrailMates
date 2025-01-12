using System.Net;
using Amazon.S3;
using Amazon.S3.Model;
using CSharpFunctionalExtensions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using TrailMates.Application.Abstractions;
using TrailMates.Domain.Errors;

namespace TrailMates.Infrastructure.Services;

public class ActivityService(IAmazonS3 s3Client, IConfiguration configuration) : IActivityService
{
    public async Task<Result<string, Error>> CreateS3BucketFolder(string activityId)
    {
        var request = new PutObjectRequest
        {
            BucketName = configuration["AWSPostsPictures:BucketName"],
            Key = $"{activityId}/",
            ContentBody = ""
        };
        await s3Client.PutObjectAsync(request);

        return $"{configuration["AWSPostsPictures:CloudfrontUrl"]}/{activityId}";
    }

    public async Task<Result<List<string>, Error>> AddActivityPictures(
        string activityId,
        List<IFormFile> pictures
    )
    {
        var addedPictures = new List<string>();
        foreach (var picture in pictures)
        {
            await using var imageStream = picture.OpenReadStream();

            var key = $"{activityId}/{Guid.NewGuid()}_{picture.FileName}";
            var contentType = GetContentType(picture.FileName);

            var putRequest = new PutObjectRequest
            {
                BucketName = configuration["AWSPostsPictures:BucketName"],
                Key = key,
                InputStream = imageStream,
                ContentType = contentType,
                Headers = { CacheControl = "max-age=0" }
            };

            var response = await s3Client.PutObjectAsync(putRequest);
            if (response.HttpStatusCode != HttpStatusCode.OK)
                return Result.Failure<List<string>, Error>(
                    ErrorsTypes.Failure($"Failed to add picture with name {picture.FileName}")
                );

            addedPictures.Add($"{configuration["AWSPostsPictures:CloudfrontUrl"]}/{key}");
        }
        return addedPictures;
    }

    public async Task<List<string>> ListAllObjectsFromFolder(string folderName)
    {
        var request = new ListObjectsV2Request
        {
            BucketName = configuration["AWSPostsPictures:BucketName"],
            Prefix = $"{folderName}/",
            Delimiter = "/"
        };

        var response = await s3Client.ListObjectsV2Async(request);

        return response
            .S3Objects.Where(s3Object => !s3Object.Key.EndsWith('/'))
            .Select(s3Object => s3Object.Key)
            .ToList();
    }

    private static string GetContentType(string fileName)
    {
        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        return extension switch
        {
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            _ => "application/octet-stream"
        };
    }
}
