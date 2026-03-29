export declare class CreateProjectDto {
    name: string;
    repoFullName: string;
    triggerConfig?: TriggerConfig;
}
export declare class UpdateTriggerConfigDto {
    triggerConfig: TriggerConfig;
}
export interface TriggerConfig {
    onPushBranches?: string[];
    onPullRequestMerged?: boolean;
    onRelease?: boolean;
    onManual?: boolean;
    notifyDev?: boolean;
    notifyUsers?: boolean;
}
