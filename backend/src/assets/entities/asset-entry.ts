import { DataTypes } from 'sequelize';
import {
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/users/entities/user.entity';
import { Asset } from './asset';

@Table({ tableName: 'asset_entry', timestamps: false })
export class AssetEntry extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ allowNull: false })
  id: number;

  @ForeignKey(() => User)
  @Column
  creator_id: number;

  @BelongsTo(() => User, 'creator_id')
  creator: User;

  @ForeignKey(() => Asset)
  @Column
  asset_id: number;

  @BelongsTo(() => Asset, "asset_id")
  asset: Asset;

  @Column({ allowNull: false, field: 'file_name' })
  fileName: string;

  @Column({ allowNull: false })
  path: string;

  // @Column({ allowNull: false })
  // url: string;

  @Column({
    field: 'created_at',
    allowNull: false,
    defaultValue: () => Math.floor(Date.now() / 1000),
  })
  createdAt: number;

  @Column({ allowNull: false, field: 'version_number' })
  versionNumber: number;
}
