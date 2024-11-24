import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import * as fs from "fs";
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { Public } from 'src/auth/auth.guard';
import { AssetService } from './asset.service';
import { AssetDto } from './dtos/asset.dto';
import { ImageService } from './image.service';

@Controller('api/v3/assets')
export class AssetsController {
  constructor(
    private readonly assetservice: AssetService,

    private readonly imageService: ImageService,
  ) {}

  @Get()
  async fetchAssets() {
    return await this.assetservice.fetchAssets();
  }

  @Public()
  @Get('image/:id')
  async fetchAssetImage(
    @Param('id') id: number,
    @Query('download') download: string,
    @Res() res: Response,
  ) {
    const assetEntry = await this.assetservice.fetchAssetEntry(id);
    if (!assetEntry) {
      throw new BadRequestException('Asset entry not found');
    }
    const localPath = assetEntry.path;
    const paths = localPath.split('.');
    const fileExtension = paths[paths.length - 1];
    const mimeType = fileExtension === 'png' ? 'image/png' : 'image/jpeg';
    res.setHeader('Content-Type', mimeType);


    const localPath2 = join(__dirname, '..', '..', 'cache', localPath);

    return this.imageService.loadImage(res, localPath2, assetEntry.fileName, download === 'true');
  }

  @Get(':id')
  async fetchAsset(@Param('id') id: number) {
    return await this.assetservice.fetchAsset(id);
  }
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, callback) => {
          const uploadPath = join(__dirname, '..', '..', 'cache');
          if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
          }
          callback(null, uploadPath);
        },
        filename: (_req, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          const filename = `${file.fieldname}-${uniqueSuffix}${ext}`;
          callback(null, filename);
        },
      }),
      limits: {
        fileSize: 20 * 1024 * 1024, // 20MB file size limit
      },
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: AssetDto,
  ) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
  
    console.log('Uploaded file:', file.originalname);
    console.log('Uploaded file saved as:', file.filename);
    console.log('Title:', body.title);
    console.log('Description:', body.description);
  
    // Create Asset and AssetEntry
    const asset = await this.assetservice.createAsset(body);
    await this.assetservice.createAssetEntry(
      asset.id,
      file.originalname,
      `${file.filename}`,
    );
  
    return {
      message: 'File uploaded successfully!',
      filename: file.filename,
      title: body.title,
      description: body.description,
      path: `/cache/${file.filename}`,
    };
  }
}
