export declare class CreateTeamDto {
    name: string;
    type: 'DEV' | 'USER';
}
export declare class AddMemberDto {
    name: string;
    email: string;
    role?: string;
}
