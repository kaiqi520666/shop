import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';
import { snowflake } from '../../../comm/snowflake';
/**
 * 描述
 */
@Entity('shop_order')
export class ShopOrderEntity extends BaseEntity {
  @Index({ unique: true })
  @Column({
    comment: '订单唯一标识',
    type: 'bigint',
    default: () => snowflake(),
  })
  uid: bigint;
  //关联用户
  @Column({ comment: '用户id' })
  userId: number;
  //关联商品
  @Column({ comment: '商品id' })
  productId: number;
  //订单状态
  @Column({ comment: '订单状态' })
  status: number;
  //订单数量
  @Column({ comment: '订单数量' })
  num: number;
}
