﻿using TrailMates.Domain.Entities.Activities;

namespace TrailMates.Application.DTO;

public record ActivityDto(
    Guid Id,
    string Title,
    string Description,
    Guid OwnerId,
    string OwnerFullName,
    Guid TrailId,
    Guid TrailCompletionId,
    bool IsTrailCompletion,
    List<Like> Likes,
    List<Comment> Comments,
    List<string> PicturesNames,
    DateTime CreatedAt
);
