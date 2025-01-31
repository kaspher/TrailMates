using MediatR;

namespace TrailMates.Application.Mediator;

public interface ICommand<out TResponse> : IRequest<TResponse>;