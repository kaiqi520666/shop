import { CoolController, BaseController } from '@cool-midway/core';
import { ShopProductEntity } from '../../entity/product';

/**
 * 描述
 */
@CoolController({
  api: ['info', 'page'],
  entity: ShopProductEntity,
})
export class OpenShopProductController extends BaseController {}
