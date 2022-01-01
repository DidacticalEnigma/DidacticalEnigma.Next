using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using DidacticalEnigma.Next.Auth;
using DidacticalEnigma.Next.Controllers;
using DidacticalEnigma.Next.InternalServices;
using DidacticalEnigma.Next.Models;
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
                launchConfiguration.UnsafeDebugMode = true;
                launchConfiguration.Secret = LaunchConfiguration.GenerateSecret();
                services.AddSingleton(launchConfiguration);
                services.AddSingleton(serviceProvider =>
                    new Webview(debug: launchConfiguration?.UnsafeDebugMode == true, interceptExternalLinks: true));
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
                if (launchConfiguration?.PublicMode != true)
                {
                    try
                    {
                        NativeFileDialogSharp.Native.NativeFunctions.NFD_Dummy();
                    }
                    catch (Exception)
                    {
                        Console.WriteLine("Failed to initialize native dialogs library, attempting to run in restricted mode");
                        throw;
                    }
                }
                
                using(var webview = webHost.Services.GetRequiredService<Webview>())
                {
                    webview.SetTitle("DidacticalEnigma.Next");
                    webview.SetSize(1024, 768, WebviewHint.None);
                    webview.SetSize(800, 600, WebviewHint.Min);
                    SetupFFI(webview, webHost.Services);
                    if (launchConfiguration != null)
                    {
                        var builder = new UriBuilder(launchConfiguration.LocalAddress)
                        {
                            Query = $"secret={HttpUtility.UrlEncode(launchConfiguration.Secret)}" + (launchConfiguration.PublicMode ? "" : "&privateMode=true")
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

        private static void SetupFFI(Webview webview, IServiceProvider serviceProvider)
        {
            string? lastOpenDirectory = null;
            webview.Bind("fileOpenDialog", (id, req) =>
            {
                var result = NativeFileDialogSharp.Dialog.FileOpen(defaultPath: lastOpenDirectory);
                if (result.IsOk)
                {
                    lastOpenDirectory = Path.GetDirectoryName(result.Path);
                }
                webview.Return(id, RPCResult.Success, JsonSerializer.Serialize(result));
            });
            webview.Bind("switchToProject", Callback);

            async void Callback(string id, string req)
            {
                var opts = new JsonSerializerOptions()
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                };
                try
                {
                    using var scope = serviceProvider.CreateScope();
                    var request = JsonSerializer.Deserialize<SwitchToProjectRequest[]>(req, opts);
                    var handler = scope.ServiceProvider.GetRequiredService<ProjectHandler>();
                    var result = await handler.SwitchToProject(request?[0] ?? throw new ArgumentNullException());
                    webview.Return(id, RPCResult.Success, JsonSerializer.Serialize(result, opts));
                }
                catch (Exception ex)
                {
                    webview.Return(id, RPCResult.Error, JsonSerializer.Serialize(new { Message = ex.Message, Error = ex.GetType().FullName }, opts));
                }
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
