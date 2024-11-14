import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { UrlService } from './urlservice';

describe('UrlService', () => {
  let service: UrlService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UrlService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UrlService>(UrlService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should return frontend URL from config', () => {
    jest.spyOn(configService, 'get').mockImplementation((key: string) => {
      if (key === 'FRONTEND_URL') return 'https://www.treibaer.de';
      return null;
    });

    expect(service.getFrontendUrl()).toBe('https://www.treibaer.de');
  });

  it('should return default frontend URL if not set in config', () => {
    jest.spyOn(configService, 'get').mockImplementation((key: string) => {
      if (key === 'FRONTEND_URL') return null;
      return null;
    });

    expect(service.getFrontendUrl()).toBe('http://localhost:3000');
  });

  it('should return backend URL from config', () => {
    jest.spyOn(configService, 'get').mockImplementation((key: string) => {
      switch (key) {
        case '_HOST':
          return 'www.treibaer.de';
        case 'PORT':
          return '443';
        case 'HTTPS':
          return 'true';
        default:
          return null;
      }
    });

    expect(service.getBackendUrl()).toBe('https://www.treibaer.de:443');
  });

  it('should return default backend URL if not set in config', () => {
    jest.spyOn(configService, 'get').mockImplementation((key: string) => {
      switch (key) {
        case '_HOST':
          return null;
        case 'PORT':
          return null;
        case 'HTTPS':
          return null;
        default:
          return null;
      }
    });

    expect(service.getBackendUrl()).toBe('http://localhost:3000');
  });
});
