import { Controller, Post, Get, Param } from '@nestjs/common';
import { ApprovalService } from './approval.service';

@Controller('notifications')
export class ApprovalController {
  constructor(private readonly approvalService: ApprovalService) {}

  @Get('pending')
  listPending() {
    return this.approvalService.listPending();
  }

  @Post(':id/approve')
  approve(@Param('id') id: string) {
    return this.approvalService.approve(id);
  }

  @Post(':id/reject')
  reject(@Param('id') id: string) {
    return this.approvalService.reject(id);
  }
}
