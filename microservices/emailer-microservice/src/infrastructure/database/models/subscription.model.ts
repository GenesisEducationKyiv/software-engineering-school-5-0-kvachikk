import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'Subscriptions', modelName: 'SubscriptionModel' })
export class SubscriptionModel extends Model {
   @Column({ type: DataType.STRING, allowNull: false })
   declare email: string;

   @Column({ type: DataType.STRING, allowNull: false })
   declare city: string;

   @Column({ type: DataType.BOOLEAN, defaultValue: false })
   declare isActive: boolean;

   @Column({ type: DataType.BOOLEAN, defaultValue: false })
   declare isVerified: boolean;

   @Column({ type: DataType.STRING, allowNull: true })
   declare verificationToken: string;

   @Column({ type: DataType.STRING, allowNull: false })
   declare frequency: string;
}
