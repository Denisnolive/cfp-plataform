import { Injectable } from '@nestjs/common';
import { SpeakerDTO } from '@cfp-platform/share-types';
import { CreateSpeakerDto } from './dto/create-speaker.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class CfpService {
  private readonly proposals: SpeakerDTO[] = [];

  create(dto: CreateSpeakerDto): SpeakerDTO {
    const speaker: SpeakerDTO = {
      id: randomUUID(),
      name: dto.name,
      email: dto.email,
      talkTitle: dto.talkTitle,
      isGDE: dto.isGDE,
    };
    this.proposals.push(speaker);
    return speaker;
  }

  findAll(): SpeakerDTO[] {
    return [...this.proposals];
  }
}
