using DidacticalEnigma.IoCModule;
using DidacticalEnigma.Mem.Client;
using DidacticalEnigma.Mem.DataSource;
using Gu.Inject;

namespace DidacticalEnigma.Next
{
    public class ServiceConfiguration
    {
        public const string ConfigurationName = "DataConfiguration";

        public string DataDirectory { get; set; }
        
        public string ConfigDirectory { get; set; }

        public static Kernel Configure(string dataDir)
        {
            var kernel = new Kernel();

            var dataSourceCollection = kernel.BindDidacticalEnigmaCoreServices(dataDir, dataDir);
            kernel.Bind(get => new DidacticalEnigmaMemViewModel());
            dataSourceCollection.Add(get => new DidacticalEnigmaMemDataSource(get.Get<DidacticalEnigmaMemViewModel>().ClientAccessor));

            return kernel;
        }
    }
}