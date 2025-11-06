import { CoolController, BaseController } from '@cool-midway/core';
import { ShopOrderEntity } from '../../entity/order';
import { UserInfoEntity } from '../../../user/entity/info';
import { ShopProductEntity } from '../../entity/product';
import { ShopOrderService } from '../../service/order';

/**
 * 描述
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: ShopOrderEntity,
  service: ShopOrderService,
  pageQueryOp: {
    select: [
      'a.*',
      'u.nickName as nickName',
      'p.title AS title',
      'p.img AS img',
      'u.avatarUrl AS avatarUrl',
      'p.price AS price',
    ],
    join: [
      {
        entity: UserInfoEntity,
        alias: 'u',
        condition: 'a.userId=u.id',
      },
      {
        entity: ShopProductEntity,
        alias: 'p',
        condition: 'a.productId=p.id',
      },
    ],
    fieldEq: ['u.nickName'],
    keyWordLikeFields: ['p.title'],
  },
})
export class AdminShopOrderController extends BaseController {}
