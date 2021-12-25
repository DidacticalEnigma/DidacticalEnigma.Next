using DidacticalEnigma.Next.InternalServices;
using Microsoft.Extensions.DependencyInjection;

namespace DidacticalEnigma.Next.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddStartupTask<T>(this IServiceCollection services)
        where T : class, IStartupTask
        => services.AddTransient<IStartupTask, T>();
}