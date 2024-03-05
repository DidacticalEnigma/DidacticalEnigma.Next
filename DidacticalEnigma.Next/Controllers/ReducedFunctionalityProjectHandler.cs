using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using DidacticalEnigma.Next.Models;
using Microsoft.AspNetCore.Mvc;

namespace DidacticalEnigma.Next.Controllers;

public class ReducedFunctionalityProjectHandler : IProjectHandler
{
    public Task<SwitchToProjectResult> SwitchToProject(SwitchToProjectRequest request)
    {
        return Task.FromResult(new SwitchToProjectResult());
    }

    public Task<ProjectListResult> ListOpenProjects(ProjectListRequest request)
    {
        var nullProjectId = new Guid("4F1B68C1-0760-4EA4-ACF3-555F0475828C");
        var projects = new List<ProjectInfoResult>();
        projects.Add(new ProjectInfoResult()
        {
            Identifier = Guid.NewGuid().ToString(),
            FriendlyName = "Scratchpad",
            Type = nullProjectId
        });
        projects.Add(new ProjectInfoResult()
        {
            Identifier = Guid.NewGuid().ToString(),
            FriendlyName = "Main",
            Type = nullProjectId
        });

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

    public Task ReceiveInput(ReceiveInputRequest request)
    {
        // do nothing
        return Task.CompletedTask;
    }
}