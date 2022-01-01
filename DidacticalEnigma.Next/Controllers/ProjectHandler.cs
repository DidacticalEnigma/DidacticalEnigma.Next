using System.Threading.Tasks;
using System.Web;
using ClipwatchSharp;
using DidacticalEnigma.Next.Models;
using SharpWebview;

namespace DidacticalEnigma.Next.Controllers;

public class ProjectHandler
{
    private readonly ClipboardWatcher clipboardWatcher;
    private readonly Webview webview;

    public ProjectHandler(ClipboardWatcher clipboardWatcher, Webview webview)
    {
        this.clipboardWatcher = clipboardWatcher;
        this.webview = webview;
    }
    
    public Task<SwitchToProjectRequest> SwitchToProject(SwitchToProjectRequest request)
    {
        if (request.ProjectId == "clipboard")
        {
            clipboardWatcher.ClipboardChanged += ClipboardWatcherOnClipboardChanged;
            clipboardWatcher.Start();
        }
        else
        {
            clipboardWatcher.Stop();
            clipboardWatcher.ClipboardChanged -= ClipboardWatcherOnClipboardChanged;
        }

        return Task.FromResult(new SwitchToProjectRequest());
    }

    private void ClipboardWatcherOnClipboardChanged(object? sender, string e)
    {
        webview.Evaluate($"clipboardNotification({HttpUtility.JavaScriptStringEncode(e, addDoubleQuotes: true)})");
    }
}