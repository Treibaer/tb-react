// image.service.ts
import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { promises as fsPromises } from 'fs';

@Injectable()
export class ImageService {
  async loadImage(
    res: Response,
    file: string,
    title: string,
    download: boolean = false,
  ) {
    const lastModified = (await fsPromises.stat(file)).mtime.getTime();
    const content = title;
    const etag = `"${lastModified}-${this.generateEtag(content)}"`;

    res.setHeader(
      'Content-Disposition',
      `${download ? 'attachment' : 'inline'};filename="${title}"`,
    );
    res.setHeader(
      'Content-Length',
      (await fsPromises.stat(file)).size.toString(),
    );
    res.setHeader('Last-Modified', new Date(lastModified).toUTCString());
    res.setHeader('Etag', etag);

    if (this.isNotModified(res, lastModified, etag)) {
      res.status(304).send();
      return;
    }

    res.sendFile(file);
  }

  isNotModified(res: Response, lastModified: number, etag: string): boolean {
    const modifiedSince = res.req.headers['if-modified-since']
      ? new Date(res.req.headers['if-modified-since']).getTime()
      : null;
    const etagHeader = res.req.headers['if-none-match'];

    return modifiedSince === lastModified && etagHeader === etag;
  }

  generateEtag(content: string): string {
    const crypto = require('crypto');
    return crypto.createHash('md5').update(content).digest('hex');
  }
}
