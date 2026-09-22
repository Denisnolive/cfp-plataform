import { shareTypes } from './share-types';
import { SpeakerDTO } from './speaker.dto';

describe('shareTypes', () => {
  it('should work', () => {
    expect(shareTypes()).toEqual('share-types');
  });

  it('should define a valid SpeakerDTO contract', () => {
    const speaker: SpeakerDTO = {
      id: '123',
      name: 'John Doe',
      email: 'john@example.com',
      talkTitle: 'Building with Angular and NestJS',
      isGDE: true,
    };
    expect(speaker.id).toBe('123');
    expect(speaker.name).toBe('John Doe');
    expect(speaker.email).toBe('john@example.com');
    expect(speaker.talkTitle).toBe('Building with Angular and NestJS');
    expect(speaker.isGDE).toBe(true);
  });
});

