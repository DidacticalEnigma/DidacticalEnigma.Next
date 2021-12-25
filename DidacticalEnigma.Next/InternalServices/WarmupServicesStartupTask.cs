using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;

namespace DidacticalEnigma.Next.InternalServices;

public class WarmupServicesStartupTask : IStartupTask
{
    private readonly IServiceCollection _services;
    private readonly IServiceProvider _provider;
    public WarmupServicesStartupTask(IServiceCollection services, IServiceProvider provider)
    {
        _services = services;
        _provider = provider;
    }

    public Task ExecuteAsync(CancellationToken cancellationToken)
    {
        foreach (var singleton in GetSingletons(_services))
        {
            // may be registered more than once, so get all at once
            _provider.GetServices(singleton);
        }

        return Task.CompletedTask;
    }

    static IEnumerable<Type> GetSingletons(IServiceCollection services)
    {
        return services
            .Where(descriptor => descriptor.Lifetime == ServiceLifetime.Singleton)
            .Where(descriptor => descriptor.ImplementationType != typeof(WarmupServicesStartupTask))
            .Where(descriptor => descriptor.ServiceType.ContainsGenericParameters == false)
            .Select(descriptor => descriptor.ServiceType)
            .Distinct();
    }
}
