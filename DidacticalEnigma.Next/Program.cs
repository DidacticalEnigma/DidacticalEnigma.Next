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
using JetBrains.Annotations;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
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
                services.AddSingleton(serviceProvider =>
                    new Webview(debug: launchConfiguration?.UnsafeDebugMode == true, interceptExternalLinks: true));
            });

            var webHost = hostBuilder.Build();
            
            var serverTask = webHost.RunAsync(cancellationTokenSource.Token);

            if (launchConfiguration?.HeadlessMode == true)
            {
                await serverTask;
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
                    webview.SetTitle("Didactical Enigma");
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
                await Task.WhenAny(serverTask, Task.Delay(TimeSpan.FromMilliseconds(500)));
            }
        }

        private static void SetupFFI(Webview webview, IServiceProvider serviceProvider)
        {
            webview.Bind("switchToProject",
                CreateRpcCallback<
                    IProjectHandler,
                    SwitchToProjectRequest,
                    SwitchToProjectResult>(
                    webview,
                    serviceProvider,
                    async (service, request) => await service.SwitchToProject(request)));
            webview.Bind("openProject",
                CreateRpcCallback<
                    IProjectHandler,
                    OpenProjectRequest,
                    OpenProjectResult>(
                    webview,
                    serviceProvider,
                    async (service, request) => await service.OpenProject(request)));
            webview.Bind("listProjects",
                CreateRpcCallback<
                    IProjectHandler,
                    ProjectListRequest,
                    ProjectListResult>(
                    webview,
                    serviceProvider,
                    async (service, request) => await service.ListOpenProjects(request)));
            webview.Bind("listProjectTypes",
                CreateRpcCallback<
                    IProjectHandler,
                    ProjectTypeListRequest,
                    ProjectTypeListResult>(
                    webview,
                    serviceProvider,
                    async (service, request) => await service.ListProjectTypes(request)));
            webview.Bind("didacticalEnigmaMemUpdateAddress",
                CreateRpcCallback<
                    IDidacticalEnigmaMemConnectionSetupHandler,
                    DidacticalEnigmaMemUpdateAddressRequest,
                    DidacticalEnigmaMemConnectionStatusResult>(
                    webview,
                    serviceProvider,
                    async (service, request) => await service.UpdateAddress(request)));
            webview.Bind("didacticalEnigmaMemSet",
                CreateRpcCallback<
                    IDidacticalEnigmaMemConnectionSetupHandler,
                    DidacticalEnigmaMemSetRequest,
                    DidacticalEnigmaMemConnectionStatusResult>(
                    webview,
                    serviceProvider,
                    async (service, request) => await service.Set(request)));
            webview.Bind("didacticalEnigmaMemReset",
                CreateRpcCallback<
                    IDidacticalEnigmaMemConnectionSetupHandler,
                    DidacticalEnigmaMemResetRequest,
                    DidacticalEnigmaMemConnectionStatusResult>(
                    webview,
                    serviceProvider,
                    async (service, request) => await service.Reset(request)));
            webview.Bind("didacticalEnigmaMemLogIn",
                CreateRpcCallback<
                    IDidacticalEnigmaMemConnectionSetupHandler,
                    DidacticalEnigmaMemLogInRequest,
                    DidacticalEnigmaMemConnectionStatusResult>(
                    webview,
                    serviceProvider,
                    async (service, request) => await service.LogIn(request)));
            webview.Bind("didacticalEnigmaMemLogOut",
                CreateRpcCallback<
                    IDidacticalEnigmaMemConnectionSetupHandler,
                    DidacticalEnigmaMemLogOutRequest,
                    DidacticalEnigmaMemConnectionStatusResult>(
                    webview,
                    serviceProvider,
                    async (service, request) => await service.LogOut(request)));
            webview.Bind("didacticalEnigmaMemCheckState",
                CreateRpcCallback<
                    IDidacticalEnigmaMemConnectionSetupHandler,
                    DidacticalEnigmaMemCheckStateRequest,
                    DidacticalEnigmaMemConnectionStatusResult>(
                    webview,
                    serviceProvider,
                    async (service, request) => await service.CheckState(request)));
        }
        
        private static Action<string, string> CreateRpcCallback<TService, TRequest, TResponse>(
            Webview webview,
            IServiceProvider serviceProvider,
            Func<TService, TRequest, Task<TResponse>> action)
            where TService : notnull
            where TRequest : notnull
            where TResponse : notnull
        {
            return Callback;
                
            async void Callback(string id, string req)
            {
                var opts = new JsonSerializerOptions()
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                };
                try
                {
                    var parameterArray = JsonSerializer.Deserialize<TRequest[]>(req, opts);
                    var request = parameterArray != null
                        ? parameterArray[0] ?? throw new JsonException()
                        : throw new JsonException();
                    using var scope = serviceProvider.CreateScope();
                    var handler = scope.ServiceProvider.GetRequiredService<TService>();
                    var result = await action(handler, request); 
                    webview.Return(id, RPCResult.Success, JsonSerializer.Serialize(result, opts));
                }
                catch (Exception ex)
                {
                    var logger = serviceProvider.GetRequiredService<ILogger<TService>>();
                    webview.Return(id, RPCResult.Error,
                        JsonSerializer.Serialize(new { Message = ex.Message, Error = ex.GetType().FullName },
                            opts));
                    logger.LogError(ex, "Error while running service");
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
