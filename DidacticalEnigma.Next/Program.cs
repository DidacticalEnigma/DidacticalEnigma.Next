using System;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using DidacticalEnigma.Next.Auth;
using Microsoft.AspNetCore.Hosting;
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
            var secretProvider = new SecretProvider();
            secretProvider.UnsafeDebugMode = true;
            secretProvider.LaunchWebView = true;
            secretProvider.Port = 7000;
            var hostBuilder = CreateHostBuilder(new [] {"--urls", $"http://127.0.0.1:{secretProvider.Port}"});
            hostBuilder.ConfigureServices(services =>
            {
                services.AddSingleton(secretProvider);
            });

            var task = hostBuilder.Build().RunAsync(cancellationTokenSource.Token);
            if (!secretProvider.LaunchWebView)
            {
                await task;
            }
            else
            {
                using(var webview = new Webview())
                {
                    webview
                        .SetTitle("DidacticalEnigma.Next")
                        .SetSize(1024, 768, WebviewHint.None)
                        .SetSize(800, 600, WebviewHint.Min)
                        .Navigate(new UrlContent($"http://127.0.0.1:{secretProvider.Port}?secret={HttpUtility.UrlEncode(secretProvider.Secret)}"))
                        .Run();
                }

                cancellationTokenSource.Cancel();
                await task;
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
