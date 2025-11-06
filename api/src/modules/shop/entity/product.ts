import { snowflake } from '../../../comm/snowflake';
import { BaseEntity } from '../../base/entity/base';
import { Column, Entity, Index } from 'typeorm';

/**
 * 描述
 */
@Entity('shop_product')
export class ShopProductEntity extends BaseEntity {
  @Index({ unique: true })
  @Column({ comment: '商品唯一id', type: 'bigint', default: () => snowflake() })
  uid: bigint;
  //商品图片
  @Column({ comment: '商品图片', type: 'varchar', length: 255 })
  img: string;
  //商品价格
  @Column({ comment: '商品价格', type: 'decimal', precision: 10, scale: 2 })
  price: number;
  //商品标题
  @Column({ comment: '商品标题', type: 'varchar', length: 255 })
  title: string;
  //商品描述
  @Column({ comment: '商品描述', type: 'text' })
  desc: string;
  //商品库存
  @Column({ comment: '商品库存', type: 'int', default: 0 })
  stock: number;
  //商品销量
  @Column({ comment: '商品销量', type: 'int', default: 0 })
  sales: number;
}
