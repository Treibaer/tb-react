import { Injectable } from '@nestjs/common';
import { Asset } from './entities/asset';
import { UserService } from 'src/users/user.service';
import { AssetEntry } from './entities/asset-entry';
import { AssetDto } from './dtos/asset.dto';

@Injectable()
export class AssetService {
  constructor(private readonly userService: UserService) {}

  async fetchAsset(assetId: number) {
    return await Asset.findByPk(assetId, {
      include: [
        {
          model: AssetEntry,
          as: 'assetEntries',
          order: [['versionNumber', 'DESC']],
        },
      ],
    });
  }

  async fetchAssets() {
    return await Asset.findAll({
      include: [
        {
          model: AssetEntry,
          as: 'assetEntries',
          order: [['versionNumber', 'DESC']],
          limit: 1,
        },
      ],
    });
  }

  async fetchAssetEntries(assetId: number) {}

  async fetchAssetEntry(entryId: number) {
    return await AssetEntry.findOne({
      where: { id: entryId },
    });
  }

  async createAsset(asset: AssetDto) {
    const user = this.userService.user;
    return await Asset.create({
      ...asset,
      creator_id: user.id,
    });
  }

  async createAssetEntry(assetId: number, fileName: string, path: string) {
    const user = this.userService.user;
    const lastEntry = await AssetEntry.findOne({
      where: { asset_id: assetId },
      order: [['versionNumber', 'DESC']],
    });
    const versionNumber = lastEntry ? lastEntry.versionNumber + 1 : 1;
    await AssetEntry.create({
      creator_id: user.id,
      asset_id: assetId,
      fileName,
      path,
      versionNumber,
    });
  }
}
