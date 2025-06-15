import {
   Table,
   Column,
   Model,
   DataType,
   BelongsTo,
   ForeignKey,
} from 'sequelize-typescript';
import { FrequencyModel } from './frequency.model';

@Table({ tableName: 'Subscriptions', modelName: 'SubscriptionModel' })
export class SubscriptionModel extends Model {
   @Column({
      type: DataType.STRING,
      allowNull: false,
   })
   declare email: string;

   @Column({
      type: DataType.STRING,
      allowNull: false,
   })
   declare city: string;

   @Column({
      type: DataType.BOOLEAN,
      defaultValue: false,
   })
   declare isActive: boolean;

   @Column({
      type: DataType.BOOLEAN,
      defaultValue: false,
   })
   declare isVerified: boolean;

   @Column({
      type: DataType.STRING,
      allowNull: true,
   })
   declare verificationToken: string;

   @ForeignKey(() => FrequencyModel)
   @Column({
      type: DataType.INTEGER,
      allowNull: false,
   })
   declare frequencyId: number;

   @Column({
      type: DataType.DATE,
      allowNull: true,
   })
   declare lastSentAt: Date;

   @BelongsTo(() => FrequencyModel, {
      foreignKey: 'frequencyId',
      as: 'Frequency',
   })
   declare frequency: FrequencyModel;
}
