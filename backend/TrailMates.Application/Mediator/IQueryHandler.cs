using MediatR;

namespace TrailMates.Application.Mediator;

public interface IQueryHandler<in TQuery, TResult> : IRequestHandler<TQuery, TResult>
    where TQuery : IQuery<TResult>;