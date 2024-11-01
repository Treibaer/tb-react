import { Controller, Get } from '@nestjs/common';
import { UrlService } from './shared/urlservice';
import { UserService } from './users/user.service';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

type Commit = {
  commitId: string;
  author: string;
  date: string;
  content: string;
};

@Controller()
export class AppController {
  constructor(
    private readonly userService: UserService,
    private readonly urlService: UrlService,
  ) {}

  @Get('api/v3/app')
  async getApp() {
    const user = this.userService.user;
    return {
      allowed: true,
      icon: `${this.urlService.getBackendUrl()}${user.avatar}`,
    };
  }
  @Get('api/v3/changelog')
  async getChangelog(): Promise<Commit[]> {
    try {
      const result = this.readGitLog();
      const commits = this.parseGitLog(result);
      return commits;
    } catch (error) {
      throw new Error('Unable to fetch changelog.');
    }
  }

  private readGitLog(): string[] {
    const filePath = this.getGitLogFilePath();
    this.ensureDirectoryExists(path.dirname(filePath));

    try {
      execSync(`git log > ${filePath}`);
      return fs.readFileSync(filePath, 'utf-8').split('\n');
    } catch (error) {
      throw new Error(`Failed to read git log: ${error.message}`);
    }
  }

  private getGitLogFilePath(): string {
    if (os.platform() === 'win32' && process.env.SystemRoot === 'C:\\WINDOWS') {
      return 'C:/temp/gitlog_kde.txt';
    } else if (
      os.platform() === 'darwin' &&
      process.env.HTTP_USER_AGENT?.includes('Macintosh') &&
      false
    ) {
      return '/tmp/gitlog_kde.txt';
    }
    return path.join(__dirname, '../cache/gitlog_kde.txt');
  }

  private ensureDirectoryExists(directory: string): void {
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }
  }

  private parseGitLog(logLines: string[]): Commit[] {
    const commits: Commit[] = [];
    let currentCommit: Partial<Commit> = {};
    let lineCount = 0;

    for (const line of logLines) {
      switch (lineCount) {
        case 0:
          currentCommit.commitId = line.split('commit ')[1];
          break;
        case 1:
          currentCommit.author = line
            .split('Author: ')[1]
            ?.split('<')[0]
            .trim();
          break;
        case 2:
          currentCommit.date = line.split('Date: ')[1].trim();
          break;
        case 3:
          break;
        case 4:
          currentCommit.content = line;
          commits.push(currentCommit as Commit);
          currentCommit = {};
          break;
        case 5:
          lineCount = -1;
          break;
      }
      lineCount++;
    }
    return commits;
  }
}
