import { Init, Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { ShopOrderEntity } from '../entity/order';

/**
 * 描述
 */
@Provide()
export class ShopOrderService extends BaseService {
  @InjectEntityModel(ShopOrderEntity)
  shopOrderEntity: Repository<ShopOrderEntity>;

  @Init()
  async init() {
    await super.init();
    this.setEntity(this.shopOrderEntity);
  }

  /**
   * 描述
   */
  async info(param: any) {
    const sql = `SELECT s.*,p.title as title,p.img as img,u.avatarUrl as avatarUrl,u.nickName as nickName FROM shop_order as s LEFT JOIN  shop_product as p on s.productId=p.id LEFT JOIN user_info as u on s.userId=u.id WHERE s.id=?`;
    const result = await this.shopOrderEntity.query(sql, [param]);
    return result[0];
  }
  async view(param: any) {
    const sql = `SELECT s.*,p.title as title,p.img as img,u.avatarUrl as avatarUrl,u.nickName as nickName,p.price as price,${'p.`desc` as `desc`'} FROM shop_order as s LEFT JOIN  shop_product as p on s.productId=p.id LEFT JOIN user_info as u on s.userId=u.id WHERE s.uid=?`;

    const result = await this.shopOrderEntity.query(sql, [param.uid]);
    console.log(result);

    return result[0];
  }
}
