using System;
using System.Threading.Tasks;
using DidacticalEnigma.Next.Models;

namespace DidacticalEnigma.Next.Controllers;

public interface IProjectHandler
{
    Task<SwitchToProjectResult> SwitchToProject(SwitchToProjectRequest request);
    
    Task<ProjectListResult> ListOpenProjects(ProjectListRequest request);

    Task<OpenProjectResult> OpenProject(OpenProjectRequest request);

    Task<ProjectTypeListResult> ListProjectTypes(ProjectTypeListRequest request);

    Task ReceiveInput(string input);
}