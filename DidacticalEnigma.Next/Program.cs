using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using DidacticalEnigma.Next.Auth;
using DidacticalEnigma.Next.InternalServices;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using SharpWebview;
using SharpWebview.Content;

namespace DidacticalEnigma.Next
{
    public class Program
    {
        [STAThread]
        public static async Task Main(string[] args)
        {
            using var cancellationTokenSource = new CancellationTokenSource();
            LaunchConfiguration? launchConfiguration = null;
            var hostBuilder = CreateHostBuilder(args);
            hostBuilder.ConfigureServices((context, services) =>
            {
                var section = context.Configuration.GetSection(LaunchConfiguration.SectionName);
                launchConfiguration = section.Get<LaunchConfiguration>();
                launchConfiguration.UnsafeDebugMode = false;
                launchConfiguration.Secret = LaunchConfiguration.GenerateSecret();
                services.AddSingleton(launchConfiguration);
            });

            var webHost = hostBuilder.Build();
            
            var startupTasks = webHost.Services.GetServices<IStartupTask>();
            var tasks = new List<Task>();
            tasks.Add(webHost.RunAsync(cancellationTokenSource.Token));

            if (launchConfiguration?.HeadlessMode == true)
            {
                foreach (var startupTask in startupTasks)
                {
                    tasks.Add(startupTask.ExecuteAsync(cancellationTokenSource.Token));
                }
                await Task.WhenAll(tasks);
            }
            else
            {
                using(var webview = new Webview())
                {
                    webview.SetTitle("DidacticalEnigma.Next");
                    webview.SetSize(1024, 768, WebviewHint.None);
                    webview.SetSize(800, 600, WebviewHint.Min);
                    if (launchConfiguration != null)
                    {
                        var builder = new UriBuilder(launchConfiguration.LocalAddress)
                        {
                            Query = $"secret={HttpUtility.UrlEncode(launchConfiguration.Secret)}&privateMode=true"
                        };
                        webview.Navigate(new UrlContent(
                            builder.ToString()));
                    }
                    else
                    {
                        webview.Navigate(new HtmlContent("<html><body>Error</body></html>"));
                    }
                    webview.Run();
                }

                cancellationTokenSource.Cancel();
                await Task.WhenAll(tasks);
            }
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
