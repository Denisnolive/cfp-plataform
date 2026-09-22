import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SpeakerDTO } from '@cfp-platform/share-types';
import { CfpService } from './cfp.service';
import { CreateSpeakerDto } from './dto/create-speaker.dto';

@Controller('cfp')
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  })
)
export class CfpController {
  constructor(private readonly cfpService: CfpService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createSpeakerDto: CreateSpeakerDto): SpeakerDTO {
    return this.cfpService.create(createSpeakerDto);
  }

  @Get()
  findAll(): SpeakerDTO[] {
    return this.cfpService.findAll();
  }
}
