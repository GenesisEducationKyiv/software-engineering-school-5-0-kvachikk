import { Model, Table, Column, HasMany, DataType } from 'sequelize-typescript';

import { SubscriptionModel } from './subscription.model';

@Table({ tableName: 'Frequencies', timestamps: true })
export class FrequencyModel extends Model<FrequencyModel> {
   @Column({
      type: DataType.STRING,
      allowNull: false,
   })
   declare title: string;

   @HasMany(() => SubscriptionModel, 'frequencyId')
   subscriptions: SubscriptionModel[];
}
