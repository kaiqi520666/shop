import { CoolController, BaseController } from '@cool-midway/core';
import { ShopPayEntity } from '../../entity/pay';
import { ShopOrderEntity } from '../../entity/order';
import { UserInfoEntity } from '../../../user/entity/info';
import { ShopProductEntity } from '../../entity/product';

/**
 * 描述
 */
@CoolController({
  api: ['info', 'page'],
  entity: ShopPayEntity,
  pageQueryOp: {
    select: [
      'a.*',
      'u.nickName as nickName',
      'o.num as num',
      'p.title as title',
      'p.price as price',
      'p.img as img',
      'u.avatarUrl as avatarUrl',
    ],
    join: [
      {
        entity: ShopOrderEntity,
        alias: 'o',
        condition: 'a.orderId=o.id',
      },
      {
        entity: UserInfoEntity,
        alias: 'u',
        condition: 'o.userId=u.id',
      },
      {
        entity: ShopProductEntity,
        alias: 'p',
        condition: 'p.id=o.productId',
      },
    ],
  },
})
export class AdminShopPayController extends BaseController {}
