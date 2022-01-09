using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Reflection;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using DidacticalEnigma.Next.Auth;
using DidacticalEnigma.Next.Controllers;
using DidacticalEnigma.Next.InternalServices;
using DidacticalEnigma.Next.Models;
using JetBrains.Annotations;
using Microsoft.AspNetCore.Connections;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Serilog;
using SharpWebview;
using SharpWebview.Content;

namespace DidacticalEnigma.Next
{
    public class Program
    {
        [STAThread]
        public static async Task<int> Main(string[] args)
        {
            var logFilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "log.txt");
            File.Delete(logFilePath);
            var logger = new LoggerConfiguration()
                .MinimumLevel.Warning()
                .WriteTo.Console()
                .WriteTo.File(logFilePath)
                .CreateLogger();
            Log.Logger = logger;
            try
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
                            Log.Error(
                                "Failed to initialize native dialogs library, attempting to run in restricted mode");
                            throw;
                        }
                    }

                    using (var webview = serverTask.IsFaulted
                               ? new Webview()
                               : webHost.Services.GetRequiredService<Webview>())
                    {
                        webview.SetTitle("Didactical Enigma");
                        webview.SetSize(1024, 768, WebviewHint.None);
                        webview.SetSize(800, 600, WebviewHint.Min);
                        SetupFFI(webview, webHost.Services);
                        if (launchConfiguration != null && !serverTask.IsFaulted)
                        {
                            var builder = new UriBuilder(launchConfiguration.LocalAddress)
                            {
                                Query = $"secret={HttpUtility.UrlEncode(launchConfiguration.Secret)}" +
                                        (launchConfiguration.PublicMode ? "" : "&privateMode=true")
                            };
                            webview.Navigate(new UrlContent(
                                builder.ToString()));
                        }
                        else
                        {
                            var ex = serverTask.Exception;
                            if (ex != null)
                            {
                                Log.Fatal(ex, "Host terminated unexpectedly");
                                webview.Navigate(PresentErrorMessage(ex, logFilePath));
                            }
                        }

                        webview.Run();
                    }

                    cancellationTokenSource.Cancel();
                    await Task.WhenAny(serverTask, Task.Delay(TimeSpan.FromMilliseconds(500)));
                }
            }
            catch (Exception ex)
            {
                Log.Fatal(ex, "Host terminated unexpectedly");
                return 1;
            }
            finally
            {
                Log.CloseAndFlush();
            }
            return 0;
        }

        private static void SetupFFI(Webview webview, IServiceProvider serviceProvider)
        {
            AddRpcCallback<
                IProjectHandler,
                SwitchToProjectRequest,
                SwitchToProjectResult>(
                "switchToProject",
                webview,
                serviceProvider,
                async (service, request) => await service.SwitchToProject(request));
            AddRpcCallback<
                IProjectHandler,
                OpenProjectRequest,
                OpenProjectResult>(
                "openProject",
                webview,
                serviceProvider,
                async (service, request) => await service.OpenProject(request));
            AddRpcCallback<
                IProjectHandler,
                ProjectListRequest,
                ProjectListResult>("listProjects",
                webview,
                serviceProvider,
                async (service, request) => await service.ListOpenProjects(request));
            AddRpcCallback<
                IProjectHandler,
                ProjectTypeListRequest,
                ProjectTypeListResult>(
                "listProjectTypes",
                webview,
                serviceProvider,
                async (service, request) => await service.ListProjectTypes(request));
            AddRpcCallback<
                IDidacticalEnigmaMemConnectionSetupHandler,
                DidacticalEnigmaMemUpdateAddressRequest,
                DidacticalEnigmaMemConnectionStatusResult>(
                "didacticalEnigmaMemUpdateAddress",
                webview,
                serviceProvider,
                async (service, request) => await service.UpdateAddress(request));
            AddRpcCallback<
                IDidacticalEnigmaMemConnectionSetupHandler,
                DidacticalEnigmaMemSetRequest,
                DidacticalEnigmaMemConnectionStatusResult>(
                "didacticalEnigmaMemSet",
                webview,
                serviceProvider,
                async (service, request) => await service.Set(request));
            AddRpcCallback<
                IDidacticalEnigmaMemConnectionSetupHandler,
                DidacticalEnigmaMemResetRequest,
                DidacticalEnigmaMemConnectionStatusResult>(
                "didacticalEnigmaMemReset",
                webview,
                serviceProvider,
                async (service, request) => await service.Reset(request));
            AddRpcCallback<
                IDidacticalEnigmaMemConnectionSetupHandler,
                DidacticalEnigmaMemLogInRequest,
                DidacticalEnigmaMemConnectionStatusResult>(
                "didacticalEnigmaMemLogIn",
                webview,
                serviceProvider,
                async (service, request) => await service.LogIn(request));
            AddRpcCallback<
                IDidacticalEnigmaMemConnectionSetupHandler,
                DidacticalEnigmaMemLogOutRequest,
                DidacticalEnigmaMemConnectionStatusResult>(
                "didacticalEnigmaMemLogOut",
                webview,
                serviceProvider,
                async (service, request) => await service.LogOut(request));
            AddRpcCallback<
                IDidacticalEnigmaMemConnectionSetupHandler,
                DidacticalEnigmaMemCheckStateRequest,
                DidacticalEnigmaMemConnectionStatusResult>(
                "didacticalEnigmaMemCheckState",
                webview,
                serviceProvider,
                async (service, request) => await service.CheckState(request));
        }
        
        private static void AddRpcCallback<TService, TRequest, TResponse>(
            string functionName,
            Webview webview,
            IServiceProvider serviceProvider,
            Func<TService, TRequest, Task<TResponse>> action)
            where TService : notnull
            where TRequest : notnull
            where TResponse : notnull
        {
            webview.Bind(functionName, Callback);
                
            async void Callback(string id, string req)
            {
                var opts = new JsonSerializerOptions()
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                };
                var logger = serviceProvider.GetRequiredService<ILogger<TService>>();
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
                    logger.LogInformation("RPC successful: call to {0}", functionName);
                }
                catch (Exception ex)
                {
                    webview.Return(id, RPCResult.Error,
                        JsonSerializer.Serialize(new { Message = ex.Message, Error = ex.GetType().FullName },
                            opts));
                    logger.LogError(ex, "Error calling {0}", functionName);
                }
            }
        }

        private static IWebviewContent PresentErrorMessage(AggregateException ex, string logFilePath)
        {
            var htmlBuilder = new StringBuilder();
            htmlBuilder.Append("<html><body><h1>Error while launching the application:</h1>");
            
            for (Exception? current = ex; current != null; current = current.InnerException)
            {
                if (current is AddressInUseException addressInUse)
                {
                    htmlBuilder.Append(
                        "<h2>The configured port is already in use by another application. Either close that application, or use a different port.</h2>");
                }
            }

            htmlBuilder.Append("Detailed log follows:<br><br>");

            htmlBuilder.Append(HttpUtility.HtmlEncode(File.ReadAllText(logFilePath)));

            htmlBuilder.Append("</body></html>");
            
            return new HtmlContent(htmlBuilder.ToString());
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .UseSerilog()
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
