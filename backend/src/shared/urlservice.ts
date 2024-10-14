import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UrlService {
  constructor(private configService: ConfigService) {}

  getFrontendUrl(): string {
    return this.configService.get<string>("FRONTEND_URL") || "http://localhost:3000";
  }

  getBackendUrl(): string {
    const host = this.configService.get<string>('_HOST') || 'localhost';
    const port = this.configService.get<string>('PORT') || '3000';
    const scheme = this.configService.get<string>('HTTPS') === 'true' ? 'https' : 'http';
    return `${scheme}://${host}:${port}`;
  }
}
