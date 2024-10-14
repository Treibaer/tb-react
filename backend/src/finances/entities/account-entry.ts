import {
  BelongsTo,
  Column,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { User } from 'src/users/entities/user.entity';
import { Account } from './account';
import { AccountTag } from './account-tag';
import { AccountPlace } from './account-place';

@Table({ tableName: 'account_entry', timestamps: false })
export class AccountEntry extends Model {
  @PrimaryKey
  @Column({ autoIncrement: true, allowNull: false })
  id: number;

  @ForeignKey(() => Account)
  @Column
  account_id: number;

  @BelongsTo(() => Account, 'account_id')
  account: Account;

  @ForeignKey(() => User)
  @Column
  creator_id: number;

  @BelongsTo(() => User, 'creator_id')
  creator: User;

  @Column({ allowNull: false })
  title: string;

  @Column({
    allowNull: false,
    field: 'created_at',
    defaultValue: () => Math.floor(Date.now() / 1000),
  })
  createdAt: number;

  @Column({ allowNull: false, field: 'value_in_cents' })
  valueInCents: number;

  @ForeignKey(() => AccountTag)
  @Column
  tag_id: number;

  @BelongsTo(() => AccountTag, 'tag_id')
  tag: AccountTag;

  @ForeignKey(() => AccountPlace)
  @Column
  place_id: number;

  @BelongsTo(() => AccountPlace, 'place_id')
  place: AccountPlace;

  @Column({ allowNull: false, field: 'purchased_at' })
  purchasedAt: number;
}
