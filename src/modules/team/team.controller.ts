import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { CreateTeamDto, AddMemberDto } from './dto/create-team.dto';

@Controller()
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get('projects/:projectId/teams')
  findByProject(@Param('projectId') projectId: string) {
    return this.teamService.findByProject(projectId);
  }

  @Post('projects/:projectId/teams')
  createTeam(
    @Param('projectId') projectId: string,
    @Body() dto: CreateTeamDto,
  ) {
    return this.teamService.createTeam(projectId, dto);
  }

  @Post('teams/:teamId/members')
  addMember(@Param('teamId') teamId: string, @Body() dto: AddMemberDto) {
    return this.teamService.addMember(teamId, dto);
  }

  @Delete('teams/:teamId/members/:memberId')
  removeMember(
    @Param('teamId') teamId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.teamService.removeMember(teamId, memberId);
  }

  @Delete('teams/:teamId')
  deleteTeam(@Param('teamId') teamId: string) {
    return this.teamService.deleteTeam(teamId);
  }
}
