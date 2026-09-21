import { SpeakerDTO } from '@cfp-platform/share-types';
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateSpeakerDto implements Omit<SpeakerDTO, 'id'> {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  talkTitle!: string;

  @IsBoolean()
  isGDE!: boolean;
}
