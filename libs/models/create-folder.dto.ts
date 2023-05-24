import { IsOptional, IsString } from 'class-validator';

export class CreateFolderDto {
  @IsString()
  title: string;

  @IsString()
  path: string;

  @IsOptional()
  @IsString()
  type: string;
}
