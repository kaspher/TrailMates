using Microsoft.EntityFrameworkCore;

namespace TrailMates.Application.Specifications.Common;

public class PagedList<T>(List<T> items, int page, int pageSize, int totalCount)
{
    public List<T> Items { get; } = items;

    public int Page { get; } = page;

    public int PageSize { get; } = pageSize;

    public int TotalCount { get; } = totalCount;

    public bool HasNextPage => Page * PageSize < TotalCount;

    public bool HasPreviousPage => Page > 1;

    public static async Task<PagedList<T>> CreateFromQuery(
        IQueryable<T> query,
        int page,
        int pageSize
    )
    {
        var totalCount = await query.CountAsync();
        var items = await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();

        return new PagedList<T>(items, page, pageSize, totalCount);
    }

    public static PagedList<T> CreateFromList(IEnumerable<T> source, int page, int pageSize)
    {
        var sourceList = source.ToList();

        var totalCount = sourceList.Count;
        var items = sourceList.Skip((page - 1) * pageSize).Take(pageSize).ToList();

        return new PagedList<T>(items, page, pageSize, totalCount);
    }
}
