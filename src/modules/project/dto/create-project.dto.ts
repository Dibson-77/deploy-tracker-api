import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  repoFullName: string;

  @IsObject()
  @IsOptional()
  triggerConfig?: TriggerConfig;
}

export class UpdateTriggerConfigDto {
  @IsObject()
  @IsNotEmpty()
  triggerConfig: TriggerConfig;
}

export interface TriggerConfig {
  onPushBranches?: string[];
  onPullRequestMerged?: boolean;
  onRelease?: boolean;
  onManual?: boolean;
  notifyDev?: boolean;
  notifyUsers?: boolean;
  requireApprovalForUsers?: boolean; // Si true, l'email USER attend une validation admin
}
