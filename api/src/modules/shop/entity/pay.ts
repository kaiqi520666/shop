import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 描述
 */
@Entity('shop_pay')
export class ShopPayEntity extends BaseEntity {
  @Index({ unique: true })
  @Column({ comment: '唯一标识', type: 'bigint', default: 0 })
  uid: bigint;

  //关联订单号
  @Column({ comment: '关联订单号', type: 'int' })
  orderId: number;

  //支付状态
  @Column({ comment: '支付状态', type: 'tinyint', default: 0 })
  status: number;

  //下单IP
  @Column({ comment: '下单IP', type: 'varchar', length: 20 })
  ip: string;

  //appId
  @Column({ comment: 'appId', type: 'varchar', length: 10, nullable: true })
  appId: string;

  //fee
  @Column({
    comment: 'fee',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  fee: number;

  //currency
  @Column({ comment: '货币', type: 'varchar', length: 10, nullable: true })
  currency: string;

  //originalCurrency
  @Column({
    comment: '原始货币',
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  originalCurrency: string;

  //orderNo
  @Column({
    comment: '平台订单号',
    type: 'varchar',
    length: 20,
    nullable: true,
  })
  orderNo: string;
}
