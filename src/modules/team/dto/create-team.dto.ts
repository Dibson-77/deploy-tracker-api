import { IsString, IsNotEmpty, IsEnum, IsEmail, IsOptional } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(['DEV', 'USER'])
  type: 'DEV' | 'USER';
}

export class AddMemberDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  role?: string;
}
