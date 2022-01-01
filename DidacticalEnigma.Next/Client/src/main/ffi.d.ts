class SwitchToProjectRequest {
    public projectId: string;
}

class SwitchToProjectResult {

}

class ProjectInfoResult {
    public type: string;
    public identifier: string;
    public friendlyName: string;
}

class ProjectListRequest {

}

class OpenProjectResult {
    public project?: ProjectInfoResult;
}

class OpenProjectRequest {
    public projectType: string;
}

class ProjectListResult {
    public projects: ProjectInfoResult[]
}

class ProjectTypeListRequest {

}

class ProjectTypeResult {
    public type: string;
    public friendlyName: string;
}

class ProjectTypeListResult {
    public projectTypes: ProjectTypeResult[];
}

declare function switchToProject(request: SwitchToProjectRequest): Promise<SwitchToProjectResult>;

declare function openProject(request: OpenProjectRequest): Promise<OpenProjectResult>;

declare function listProjects(request: ProjectListRequest): Promise<ProjectListResult>;

declare function listProjectTypes(request: ProjectTypeListRequest): Promise<ProjectTypeListResult>;