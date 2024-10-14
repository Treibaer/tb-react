import {
  AutoIncrement,
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({ tableName: 'user', timestamps: false })
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({ allowNull: false })
  id: number;

  @Column
  username: string;

  @Column({ field: 'selected_project_id', allowNull: false, defaultValue: 0 })
  selectedProjectId: number;

  @Column({ allowNull: false, defaultValue: '' })
  email: string;

  @Column({ field: 'first_name', allowNull: false })
  firstName: string;

  @Column({ defaultValue: '[]' })
  roles: string;

  @Column({ field: 'last_name', allowNull: false, defaultValue: '' })
  lastName: string;

  @Column
  password: string;

  @Column
  avatar: string;

  @Column
  language: string;

  @Column({ field: 'opened_pages', type: DataType.TEXT('long') })
  openedPages: string;

  @Column({ field: 'closed_boards', type: DataType.TEXT('long') })
  closedBoards: string;

  @Column({ field: 'hide_done_projects', type: DataType.TEXT('long') })
  hideDoneProjects: string;

  @Column({ field: 'is_admin' })
  isAdmin: boolean;

  @Column({ field: 'project_access' })
  projectAccess: string;

  @Column({ field: 'maximized', allowNull: false })
  maximized: string;

  @Column({ field: 'selected_year', allowNull: false, defaultValue: 3000 })
  selectedYear: number;

  @Column({ field: 'phone_number', allowNull: false })
  phoneNumber: string;

  @Column({ field: 'date_of_birth', allowNull: false })
  dateOfBirth: string;

  @Column({
    field: 'created_at',
    allowNull: false,
    defaultValue: () => Math.floor(Date.now() / 1000),
  })
  createdAt: number;
}
