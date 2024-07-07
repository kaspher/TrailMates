using MediatR;

namespace TrailMates.Application.Mediator;

public interface IQuery<out TResponse> : IRequest<TResponse>;