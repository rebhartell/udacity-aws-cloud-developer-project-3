import { AllowNull, Column, CreatedAt, Model, PrimaryKey, Table, UpdatedAt } from 'sequelize-typescript';

@Table
export class User extends Model<User> {

  // REBH: This contradicts 20190328-create-user.js which has an id
  // REBH: How can PrimaryKey be nullable  
  @PrimaryKey
  @Column
  public email!: string;

  // REBH: Not sure the ! does anything - supposed to make field nullable
  @Column
  public password_hash!: string; // for nullable fields

  @AllowNull(false)
  @Column
  @CreatedAt
  public createdAt: Date = new Date();

  @AllowNull(false)
  @Column
  @UpdatedAt
  public updatedAt: Date = new Date();

  short() {
    return {
      email: this.email
    }
  }
}
