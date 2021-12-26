using System;
using System.Security.Claims;
using System.Text.Json.Serialization;
using DidacticalEnigma.Core.Models.DataSources;
using DidacticalEnigma.Core.Models.Formatting;
using DidacticalEnigma.Core.Models.HighLevel.KanjiLookupService;
using DidacticalEnigma.Core.Models.LanguageService;
using DidacticalEnigma.Next.Auth;
using DidacticalEnigma.Next.Extensions;
using DidacticalEnigma.Next.InternalServices;
using DidacticalEnigma.Next.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Hosting.Server.Features;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Hosting;
using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;

namespace DidacticalEnigma.Next
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            var rawLaunchConfiguration = Configuration.GetSection(LaunchConfiguration.SectionName);
            var launchConfiguration = rawLaunchConfiguration.Get<LaunchConfiguration>();
            
            services.AddAuthentication(AuthenticationSecretConfig.Scheme)
                .AddScheme<AuthenticationSecretConfig, AuthenticationSecretHandler>(
                    AuthenticationSecretConfig.Scheme,
                    options => { });

            services.AddAuthorization(options =>
            {
                var rejectAnonymousPolicy = new AuthorizationPolicyBuilder()
                    .RequireAuthenticatedUser()
                    .RequireClaim(ClaimTypes.Name)
                    .Build();
                
                var allowAnonymousPolicy = new AuthorizationPolicyBuilder()
                    .RequireAuthenticatedUser()
                    .Build();
                
                options.AddPolicy("AllowAnonymous", allowAnonymousPolicy);
                options.AddPolicy("RejectAnonymous", rejectAnonymousPolicy);

                var defaultPolicy = launchConfiguration.PublicMode
                    ? allowAnonymousPolicy
                    : rejectAnonymousPolicy;
                
                options.DefaultPolicy = defaultPolicy;
                options.FallbackPolicy = defaultPolicy;
            });
            
            services
                .AddControllers()
                .AddJsonOptions(opts =>
                {
                    opts.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                });

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo {Title = "DidacticalEnigma.Next", Version = "v1"});
                c.EnableAnnotations();
                c.UseInlineDefinitionsForEnums();
                c.UseAllOfForInheritance();
                c.UseOneOfForPolymorphism();
                
                c.MapType<Length>(() => new OpenApiSchema
                {
                    Type = "string",
                    Example = new OpenApiString("2*")
                });
            });

            var rawConfig = Configuration.GetSection(ServiceConfiguration.ConfigurationName);
            services.Configure<ServiceConfiguration>(rawConfig);

            var config = rawConfig.Get<ServiceConfiguration>();

            var kernel = ServiceConfiguration.Configure(config.DataDirectory);
            
            services.AddSingleton(_ => kernel.Get<ISentenceParser>());
            services.AddSingleton(_ => kernel.Get<IRadicalSearcher>());
            services.AddSingleton(_ => kernel.Get<IAutoGlosser>());
            services.AddSingleton(_ => kernel.Get<IKanjiLookupService>());
            services.AddSingleton(_ => kernel.Get<IRelated>());
            services.AddSingleton(_ => kernel.Get<DataSourceDispatcher>());
            services.AddSingleton(_ => kernel.Get<XmlRichFormattingRenderer>());
            services.AddSingleton(_ => kernel.Get<DisclaimersGetter>());
            
            services
                .AddStartupTask<WarmupServicesStartupTask>()
                .TryAddSingleton(services);
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IHostApplicationLifetime lifetime)
        {
            lifetime.ApplicationStarted.Register(
                () =>
                {
                    var addressesFeature = app.ServerFeatures.Get<IServerAddressesFeature>() ?? throw new InvalidOperationException();
                    var secretProvider = app.ApplicationServices.GetRequiredService<LaunchConfiguration>() ?? throw new InvalidOperationException();
                    foreach(var address in addressesFeature.Addresses)
                    {
                        var uri = new Uri(address);
                        if (uri.IsLoopback)
                        {
                            secretProvider.LocalAddress = uri;
                        }
                        else
                        {
                            secretProvider.UnsafeDebugMode = false;
                        }
                    }
                });
            
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseSwagger(c =>
            {
                c.SerializeAsV2 = true;
            });

            // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
            // specifying the Swagger JSON endpoint.
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "DidacticalEnigma.Next V1");
                c.RoutePrefix = "Api";
            });

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();
            
            app.UseStaticFiles();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
                endpoints.MapFallbackToFile("index.html");
            });
        }
    }
}
