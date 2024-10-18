import { Module } from '@nestjs/common';
import { AssetsController } from './assets.controller';
import { AssetService } from './asset.service';
import { UsersModule } from 'src/users/users.module';
import { ImageService } from './image.service';

@Module({
  imports: [UsersModule],
  controllers: [AssetsController],
  providers: [AssetService, ImageService],
})
export class AssetsModule {}
