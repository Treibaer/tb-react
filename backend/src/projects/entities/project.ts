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

@Table({ tableName: 'project', timestamps: false })
export class Project extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ allowNull: false })
  id: number;

  @Column({ allowNull: false })
  icon: string;

  @Column({ allowNull: false })
  title: string;

  @Column({ allowNull: false, defaultValue: '' })
  description: string;

  @Column({ allowNull: false, field: 'short' })
  slug: string;

  @ForeignKey(() => User)
  @Column
  creator_id: number;

  @BelongsTo(() => User, 'creator_id')
  creator: User;

  @Column({ allowNull: false, field: 'archived', defaultValue: false })
  isArchived: boolean;

  @Column({ allowNull: false, field: 'public', defaultValue: true })
  isPublic: boolean;

  @Column({
    field: 'created_at',
    allowNull: false,
    defaultValue: () => Math.floor(Date.now() / 1000),
  })
  createdAt: number;

  @Column({ allowNull: false, defaultValue: '' })
  perspective: string;

  @Column({ allowNull: false, defaultValue: '' })
  setting: string;

  @Column({ allowNull: false, field: 'game_engine', defaultValue: '' })
  gameEngine: string;

  @Column({ allowNull: false, field: 'number_of_players', defaultValue: '' })
  numberOfPlayers: string;

  @Column({ allowNull: false, field: 'battle_system', defaultValue: '' })
  battleSystem: string;

  @Column({ allowNull: false, defaultValue: '' })
  tags: string;

  @Column({ allowNull: false, defaultValue: '' })
  input: string;

  @Column({ allowNull: false, defaultValue: '' })
  platforms: string;

  @Column({ allowNull: false, field: 'graphic_style', defaultValue: '' })
  graphicStyle: string;

  @Column({
    allowNull: false,
    field: 'unique_selling_points',
    defaultValue: '',
  })
  uniqueSellingPoints: string;

  @Column({ allowNull: false, field: 'cover_image', defaultValue: '' })
  coverImage: string;
}
