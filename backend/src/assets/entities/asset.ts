import { DataTypes } from 'sequelize';
import {
  HasMany,
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/users/entities/user.entity';
import { AssetEntry } from './asset-entry';

@Table({ tableName: 'asset', timestamps: false })
export class Asset extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ allowNull: false })
  id: number;

  @ForeignKey(() => User)
  @Column
  creator_id: number;

  @BelongsTo(() => User, 'creator_id')
  creator: User;

  @Column({ allowNull: false })
  title: string;

  @Column({ allowNull: false, type: DataTypes.TEXT('long') })
  description: string;

  @Column({ allowNull: false, type: DataTypes.TEXT('long'), defaultValue: '' })
  notes: string;

  @Column({
    field: 'created_at',
    allowNull: false,
    defaultValue: () => Math.floor(Date.now() / 1000),
  })
  createdAt: number;

  @Column({ allowNull: false, defaultValue: false })
  archived: boolean;

  // Define the HasMany relationship
  @HasMany(() => AssetEntry, 'asset_id')
  assetEntries: AssetEntry[]; // This tells Sequelize that an Asset has many AssetEntries
}
