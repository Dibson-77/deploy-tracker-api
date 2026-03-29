import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { GithubService } from '../../shared/services/github.service';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService, GithubService],
  exports: [ProjectService],
})
export class ProjectModule {}
