import { PrismaService } from '../../shared/services/prisma.service';
import { CreateTeamDto, AddMemberDto } from './dto/create-team.dto';
export declare class TeamService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByProject(projectId: string): Promise<({
        members: {
            name: string;
            id: string;
            email: string;
            role: string;
            teamId: string;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        type: import("@prisma/client").$Enums.TeamType;
        projectId: string;
    })[]>;
    createTeam(projectId: string, dto: CreateTeamDto): Promise<{
        members: {
            name: string;
            id: string;
            email: string;
            role: string;
            teamId: string;
        }[];
    } & {
        name: string;
        id: string;
        createdAt: Date;
        type: import("@prisma/client").$Enums.TeamType;
        projectId: string;
    }>;
    addMember(teamId: string, dto: AddMemberDto): Promise<{
        name: string;
        id: string;
        email: string;
        role: string;
        teamId: string;
    }>;
    removeMember(teamId: string, memberId: string): Promise<{
        name: string;
        id: string;
        email: string;
        role: string;
        teamId: string;
    }>;
    deleteTeam(teamId: string): Promise<{
        name: string;
        id: string;
        createdAt: Date;
        type: import("@prisma/client").$Enums.TeamType;
        projectId: string;
    }>;
}
