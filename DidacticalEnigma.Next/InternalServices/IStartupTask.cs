using System.Threading;
using System.Threading.Tasks;

namespace DidacticalEnigma.Next.InternalServices;

public interface IStartupTask
{
    Task ExecuteAsync(CancellationToken cancellationToken = default);
}
