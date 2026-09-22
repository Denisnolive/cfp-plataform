import {
  ArgumentMetadata,
  BadRequestException,
  ValidationPipe,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CfpController } from './cfp.controller';
import { CfpService } from './cfp.service';
import { CreateSpeakerDto } from './dto/create-speaker.dto';

describe('CfpController', () => {
  let controller: CfpController;
  let service: CfpService;
  let validationPipe: ValidationPipe;
  const metadata: ArgumentMetadata = {
    type: 'body',
    metatype: CreateSpeakerDto,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CfpController],
      providers: [CfpService],
    }).compile();

    controller = module.get<CfpController>(CfpController);
    service = module.get<CfpService>(CfpService);
    validationPipe = new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    });
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a speaker proposal with generated id and status 201 equivalent', () => {
      const dto: CreateSpeakerDto = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        talkTitle: 'Mastering NestJS & Angular',
        isGDE: false,
      };

      const result = controller.create(dto);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(typeof result.id).toBe('string');
      expect(result.name).toBe('Jane Doe');
      expect(result.email).toBe('jane@example.com');
      expect(result.talkTitle).toBe('Mastering NestJS & Angular');
      expect(result.isGDE).toBe(false);
    });
  });

  describe('findAll', () => {
    it('should return empty array when no proposals exist', () => {
      const result = controller.findAll();
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });

    it('should return all submitted proposals matching SpeakerDTO contract', () => {
      const dto: CreateSpeakerDto = {
        name: 'John Doe',
        email: 'john@example.com',
        talkTitle: 'Signals in Practice',
        isGDE: true,
      };
      const created = controller.create(dto);

      const all = controller.findAll();
      expect(all.length).toBe(1);
      expect(all[0]).toEqual(created);
      expect(all[0].name).toBe('John Doe');
      expect(all[0].email).toBe('john@example.com');
      expect(all[0].talkTitle).toBe('Signals in Practice');
      expect(all[0].isGDE).toBe(true);
    });
  });

  describe('ValidationPipe', () => {
    it('should accept a valid speaker payload', async () => {
      const validPayload = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        talkTitle: 'Deep Dive into Signals',
        isGDE: true,
      };

      const transformed = await validationPipe.transform(validPayload, metadata);
      expect(transformed).toEqual(validPayload);
    });

    it('should reject payload with empty required fields with HTTP 400 Bad Request', async () => {
      const invalidPayload = {
        name: '',
        email: '',
        talkTitle: '',
        isGDE: true,
      };

      try {
        await validationPipe.transform(invalidPayload, metadata);
        fail('Should have thrown BadRequestException');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        const badReq = error as BadRequestException;
        expect(badReq.getStatus()).toBe(400);
      }
    });

    it('should reject payload with missing required fields with HTTP 400 Bad Request', async () => {
      const invalidPayload = {
        email: 'jane@example.com',
      };

      try {
        await validationPipe.transform(invalidPayload, metadata);
        fail('Should have thrown BadRequestException');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        const badReq = error as BadRequestException;
        expect(badReq.getStatus()).toBe(400);
      }
    });

    it('should reject malformed email with HTTP 400 Bad Request', async () => {
      const invalidPayload = {
        name: 'Jane Doe',
        email: 'invalid-email-format',
        talkTitle: 'Architecture at Scale',
        isGDE: false,
      };

      try {
        await validationPipe.transform(invalidPayload, metadata);
        fail('Should have thrown BadRequestException');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        const badReq = error as BadRequestException;
        expect(badReq.getStatus()).toBe(400);
      }
    });

    it('should reject extra unwhitelisted properties with HTTP 400 Bad Request', async () => {
      const extraPropPayload = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        talkTitle: 'Valid Title',
        isGDE: true,
        unauthorizedField: 'malicious',
      };

      try {
        await validationPipe.transform(extraPropPayload, metadata);
        fail('Should have thrown BadRequestException');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        const badReq = error as BadRequestException;
        expect(badReq.getStatus()).toBe(400);
      }
    });

    it('should reject invalid non-boolean isGDE value with HTTP 400 Bad Request', async () => {
      const invalidPayload = {
        name: 'Jane Doe',
        email: 'jane@example.com',
        talkTitle: 'Valid Title',
        isGDE: 'not-a-boolean',
      };

      try {
        await validationPipe.transform(invalidPayload, metadata);
        fail('Should have thrown BadRequestException');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        const badReq = error as BadRequestException;
        expect(badReq.getStatus()).toBe(400);
      }
    });
  });
});
