﻿using DidacticalEnigma.IoCModule;
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
        
        public string? DidacticalEnigmaMemAddress { get; set; }

        public static Kernel Configure(ServiceConfiguration config)
        {
            var kernel = new Kernel();

            var dataSourceCollection = kernel.BindDidacticalEnigmaCoreServices(config.DataDirectory, config.DataDirectory);
            kernel.Bind(get =>
            {
                var vm = new DidacticalEnigmaMemViewModel();
                if (config.DidacticalEnigmaMemAddress != null)
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