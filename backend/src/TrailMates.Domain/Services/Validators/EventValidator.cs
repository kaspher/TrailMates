using CSharpFunctionalExtensions;
using TrailMates.Domain.Entities.Events;
using TrailMates.Domain.Errors;

namespace TrailMates.Domain.Services.Validators;

public static class EventValidator
{
    public static UnitResult<Error> ValidateJoinEvent(Event entity, Guid userId)
    {
        if (entity.Status != EventStatus.Open)
            return UnitResult.Failure(ErrorsTypes.BadRequest("Event is not open to registration."));

        if (entity.ParticipantsIds.Count >= entity.ParticipantsLimit)
            return UnitResult.Failure(
                ErrorsTypes.BadRequest("Event participants limit has been reached.")
            );

        if (entity.ParticipantsIds.Contains(userId))
            return UnitResult.Failure(
                ErrorsTypes.BadRequest("User already participates in that event.")
            );

        return UnitResult.Success<Error>();
    }
}
