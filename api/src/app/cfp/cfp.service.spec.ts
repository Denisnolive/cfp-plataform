import { Test, TestingModule } from '@nestjs/testing';
import { CfpService } from './cfp.service';
import { CreateSpeakerDto } from './dto/create-speaker.dto';

describe('CfpService', () => {
  let service: CfpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CfpService],
    }).compile();

    service = module.get<CfpService>(CfpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create and store a proposal with generated id', () => {
    const dto: CreateSpeakerDto = {
      name: 'Alice Smith',
      email: 'alice@example.com',
      talkTitle: 'Clean Architecture with NestJS',
      isGDE: true,
    };

    const created = service.create(dto);

    expect(created).toBeDefined();
    expect(created.id).toBeDefined();
    expect(typeof created.id).toBe('string');
    expect(created.name).toBe(dto.name);
    expect(created.email).toBe(dto.email);
    expect(created.talkTitle).toBe(dto.talkTitle);
    expect(created.isGDE).toBe(dto.isGDE);

    const all = service.findAll();
    expect(all).toContainEqual(created);
  });
});
