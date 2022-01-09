using System;
using System.IO;
using DidacticalEnigma.IoCModule;
using DidacticalEnigma.Mem.Client;
using DidacticalEnigma.Mem.DataSource;
using Gu.Inject;

namespace DidacticalEnigma.Next
{
    public class ServiceConfiguration
    {
        public const string ConfigurationName = "DataConfiguration";

        public string? DataDirectory { get; set; }
        
        public string? ConfigDirectory { get; set; }
        
        public string? DidacticalEnigmaMemAddress { get; set; }

        public string GetDataDirectory()
        {
            var dir = string.IsNullOrWhiteSpace(this.DataDirectory)
                ? Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data")
                : this.DataDirectory;
            return dir;
        }
        
        public string GetConfigDirectory()
        {
            var dir = string.IsNullOrWhiteSpace(this.ConfigDirectory)
                ? AppDomain.CurrentDomain.BaseDirectory
                : this.ConfigDirectory;
            return dir;
        }

        public static Kernel Configure(ServiceConfiguration config)
        {
            var kernel = new Kernel();

            var dataDir = config.GetDataDirectory();
            var dataSourceCollection = kernel.BindDidacticalEnigmaCoreServices(dataDir, dataDir);
            kernel.Bind(get =>
            {
                var vm = new DidacticalEnigmaMemViewModel();
                if (!string.IsNullOrWhiteSpace(config.DidacticalEnigmaMemAddress))
                {
                    vm.Uri = config.DidacticalEnigmaMemAddress;
                    vm.Initialize.Execute(null);
                }

                return vm;
            });
            dataSourceCollection.Add(get => new DidacticalEnigmaMemDataSource(get.Get<DidacticalEnigmaMemViewModel>().ClientAccessor));

            return kernel;
        }
    }
}