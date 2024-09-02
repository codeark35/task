import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo
} from "sequelize-typescript";
import { User } from "./user";
import { UUID } from "crypto";

@Table({
  tableName: "tasks",
  timestamps: true,
})
export class Task extends Model<Task> {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  title!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  description!: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  })
  date!: Date;
  
  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,  // Changed from INTEGER to UUID
    allowNull: false,
  })
  userId!: string;  // Changed from UUID to string to match User's uuid type

  @BelongsTo(() => User)
  user!: User;
}