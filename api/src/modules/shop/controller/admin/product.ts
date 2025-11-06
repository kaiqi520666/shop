import { CoolController, BaseController } from '@cool-midway/core';
import { ShopProductEntity } from '../../entity/product';

/**
 * 描述
 */
@CoolController({
  api: ['add', 'delete', 'update', 'info', 'list', 'page'],
  entity: ShopProductEntity,
  pageQueryOp: {
    keyWordLikeFields: ['a.title'],
  },
})
export class AdminShopProductController extends BaseController {}
