import { AllowNull, Column, CreatedAt, Model, Table, UpdatedAt } from 'sequelize-typescript';

@Table
export class FeedItem extends Model<FeedItem> {
  
  // REBH: Not sure the ! does anything - supposed to make field nullable
  @Column
  public caption!: string;

  @Column
  public url!: string;

  @AllowNull(false)
  @Column
  @CreatedAt
  public createdAt: Date = new Date();

  @AllowNull(false)
  @Column
  @UpdatedAt
  public updatedAt: Date = new Date();
}
