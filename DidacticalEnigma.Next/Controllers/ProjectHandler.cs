using System;
using System.Collections.Concurrent;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using ClipwatchSharp;
using DidacticalEnigma.Next.Models;
using SharpWebview;

namespace DidacticalEnigma.Next.Controllers
{
    public class ProjectHandler : IProjectHandler, IDisposable
    {
        private readonly ClipboardWatcher clipboardWatcher;
        private readonly Webview webview;
        private readonly ConcurrentBag<ProjectInfoResult> projects;
        private string currentProjectId; 
        
        private static readonly Guid ClipboardProjectType = new Guid("1DE9DE5E-E5CB-488A-A1F1-FF9DA6F50A22");
        private static readonly Guid RestReceiverProjectType = new Guid("E44277D6-54F7-4023-B583-D2F866341CB7");
        private static readonly Guid NullProjectType = new Guid("4F1B68C1-0760-4EA4-ACF3-555F0475828C");
        

        public ProjectHandler(ClipboardWatcher clipboardWatcher, Webview webview)
        {
            this.clipboardWatcher = clipboardWatcher;
            this.webview = webview;
            this.projects = CreateProjects();
            this.currentProjectId = this.projects.First(project => project.FriendlyName == "Main").Identifier;
        }

        private ConcurrentBag<ProjectInfoResult> CreateProjects()
        {
            var projects = new ConcurrentBag<ProjectInfoResult>();
            projects.Add(new ProjectInfoResult()
            {
                Identifier = Guid.NewGuid().ToString(),
                FriendlyName = "Direct input",
                Type = RestReceiverProjectType
            });
            projects.Add(new ProjectInfoResult()
            {
                Identifier = Guid.NewGuid().ToString(),
                FriendlyName = "Clipboard",
                Type = ClipboardProjectType
            });
            projects.Add(new ProjectInfoResult()
            {
                Identifier = Guid.NewGuid().ToString(),
                FriendlyName = "Scratchpad",
                Type = NullProjectType
            });
            projects.Add(new ProjectInfoResult()
            {
                Identifier = Guid.NewGuid().ToString(),
                FriendlyName = "Main",
                Type = NullProjectType
            });

            return projects;
        }

        public Task<SwitchToProjectResult> SwitchToProject(SwitchToProjectRequest request)
        {
            var selectedProject = projects.FirstOrDefault(project => project.Identifier == request.ProjectId);
            if (selectedProject == null)
            {
                return Task.FromResult(new SwitchToProjectResult());
            }

            if (currentProjectId == selectedProject.Identifier)
            {
                return Task.FromResult(new SwitchToProjectResult());
            }
            
            if (selectedProject.Type == ClipboardProjectType)
            {
                clipboardWatcher.ClipboardChanged += ClipboardWatcherOnClipboardChanged;
                clipboardWatcher.Start();
            }
            else
            {
                clipboardWatcher.Stop();
                clipboardWatcher.ClipboardChanged -= ClipboardWatcherOnClipboardChanged;
            }

            currentProjectId = selectedProject.Identifier;

            return Task.FromResult(new SwitchToProjectResult());
        }

        public Task<ProjectListResult> ListOpenProjects(ProjectListRequest request)
        {
            return Task.FromResult(new ProjectListResult()
            {
                Projects = projects
            });
        }

        public Task<OpenProjectResult> OpenProject(OpenProjectRequest request)
        {
            return Task.FromResult(new OpenProjectResult()
            {
                Project = null
            });
        }

        public Task<ProjectTypeListResult> ListProjectTypes(ProjectTypeListRequest request)
        {
            return Task.FromResult(new ProjectTypeListResult()
            {
                ProjectTypes = Array.Empty<ProjectTypeResult>()
            });
        }

        public Task ReceiveInput(string input)
        {
            var p = projects.FirstOrDefault(p => p.Type == RestReceiverProjectType);
            if (p == null || p.Identifier != currentProjectId)
            {
                return Task.CompletedTask;
            }
            
            webview.Dispatch(() =>
            {
                webview.Evaluate($"restReceiverNotification({HttpUtility.JavaScriptStringEncode(input, addDoubleQuotes: true)})");
            });
            return Task.CompletedTask;
        }

        private void ClipboardWatcherOnClipboardChanged(object? sender, string e)
        {
            webview.Dispatch(() =>
            {
                webview.Evaluate($"clipboardNotification({HttpUtility.JavaScriptStringEncode(e, addDoubleQuotes: true)})");
            });
        }

        public void Dispose()
        {
            clipboardWatcher.Stop();
            clipboardWatcher.ClipboardChanged -= ClipboardWatcherOnClipboardChanged;
        }
    }
}