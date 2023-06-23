import { Test, TestingModule } from '@nestjs/testing';
import { Hash } from '../bcrypt';

describe('Hash', () => {
  let service: Hash;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Hash],
    }).compile();

    service = module.get<Hash>(Hash);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
