﻿using TrailMates.Domain.Entities.Activities;

namespace TrailMates.Application.DTO;

public class ActivityDto(
    Guid Id,
    string Title,
    string Description,
    Guid OwnerId,
    string OwnerFullName,
    Guid TrailId,
    List<Like> Likes,
    List<Comment> Comments,
    DateTime CreatedAt
);
