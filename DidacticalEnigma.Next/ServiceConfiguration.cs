using DidacticalEnigma.IoCModule;
using Gu.Inject;

namespace DidacticalEnigma.Next
{
    public class ServiceConfiguration
    {
        public const string ConfigurationName = "DataConfiguration";

        public string DataDirectory { get; set; }

        public static Kernel Configure(string dataDir)
        {
            var kernel = new Kernel();

            kernel.BindDidacticalEnigmaCoreServices(dataDir, dataDir);

            return kernel;
        }
    }
}