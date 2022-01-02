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

class DidacticalEnigmaMemUpdateAddressRequest {
    public url: string;
}

class DidacticalEnigmaMemResetRequest {
    
}

class DidacticalEnigmaMemLogInRequest {
    
}

class DidacticalEnigmaMemLogOutRequest {
    
}

class DidacticalEnigmaMemCheckStateRequest {
    
}

class DidacticalEnigmaMemConnectionStatusResult {
    public isSet: boolean;
    public isNotSet: boolean;
    public verificationUri?: string;
    public userCode?: string;
    public isLoggedIn: boolean;
    public isLoggingIn: boolean;
    public canSet: boolean;
    public canReset: boolean;
    public canLogIn: boolean;
    public canLogOut: boolean;
    public uri?: string;
    public prompt?: string;
    public error?: string;
}

declare function switchToProject(request: SwitchToProjectRequest): Promise<SwitchToProjectResult>;

declare function openProject(request: OpenProjectRequest): Promise<OpenProjectResult>;

declare function listProjects(request: ProjectListRequest): Promise<ProjectListResult>;

declare function listProjectTypes(request: ProjectTypeListRequest): Promise<ProjectTypeListResult>;

declare function didacticalEnigmaMemUpdateAddress(request: DidacticalEnigmaMemUpdateAddressRequest): Promise<DidacticalEnigmaMemConnectionStatusResult>;

declare function didacticalEnigmaMemSet(request: DidacticalEnigmaMemSetRequest): Promise<DidacticalEnigmaMemConnectionStatusResult>;

declare function didacticalEnigmaMemReset(request: DidacticalEnigmaMemResetRequest): Promise<DidacticalEnigmaMemConnectionStatusResult>;

declare function didacticalEnigmaMemLogIn(request: DidacticalEnigmaMemLogInRequest): Promise<DidacticalEnigmaMemConnectionStatusResult>;

declare function didacticalEnigmaMemLogOut(request: DidacticalEnigmaMemLogOutRequest): Promise<DidacticalEnigmaMemConnectionStatusResult>;

declare function didacticalEnigmaMemCheckState(request: DidacticalEnigmaMemCheckStateRequest): Promise<DidacticalEnigmaMemConnectionStatusResult>;