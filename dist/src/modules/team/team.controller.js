"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamController = void 0;
const common_1 = require("@nestjs/common");
const team_service_1 = require("./team.service");
const create_team_dto_1 = require("./dto/create-team.dto");
let TeamController = class TeamController {
    teamService;
    constructor(teamService) {
        this.teamService = teamService;
    }
    findByProject(projectId) {
        return this.teamService.findByProject(projectId);
    }
    createTeam(projectId, dto) {
        return this.teamService.createTeam(projectId, dto);
    }
    addMember(teamId, dto) {
        return this.teamService.addMember(teamId, dto);
    }
    removeMember(teamId, memberId) {
        return this.teamService.removeMember(teamId, memberId);
    }
    deleteTeam(teamId) {
        return this.teamService.deleteTeam(teamId);
    }
};
exports.TeamController = TeamController;
__decorate([
    (0, common_1.Get)('projects/:projectId/teams'),
    __param(0, (0, common_1.Param)('projectId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "findByProject", null);
__decorate([
    (0, common_1.Post)('projects/:projectId/teams'),
    __param(0, (0, common_1.Param)('projectId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_team_dto_1.CreateTeamDto]),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "createTeam", null);
__decorate([
    (0, common_1.Post)('teams/:teamId/members'),
    __param(0, (0, common_1.Param)('teamId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_team_dto_1.AddMemberDto]),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "addMember", null);
__decorate([
    (0, common_1.Delete)('teams/:teamId/members/:memberId'),
    __param(0, (0, common_1.Param)('teamId')),
    __param(1, (0, common_1.Param)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "removeMember", null);
__decorate([
    (0, common_1.Delete)('teams/:teamId'),
    __param(0, (0, common_1.Param)('teamId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TeamController.prototype, "deleteTeam", null);
exports.TeamController = TeamController = __decorate([
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [team_service_1.TeamService])
], TeamController);
//# sourceMappingURL=team.controller.js.map