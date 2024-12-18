using CSharpFunctionalExtensions;
using TrailMates.Application.Features.Activities.Queries;
using TrailMates.Application.Features.Activities.Queries.GetActivities;
using TrailMates.Application.Specifications.Common;
using TrailMates.Domain.Entities.Activities;
using TrailMates.Domain.Errors;

namespace TrailMates.Application.Abstractions.Repositories;

public interface IActivityRepository
{
    Task<Result<PagedList<Activity>, Error>> GetAll(
        GetActivitiesRequest request,
        CancellationToken cancellationToken = default
    );

    Task AddActivity(Activity activity);
}
