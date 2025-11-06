import { CoolController, BaseController } from '@cool-midway/core';
import { ShopOrderEntity } from '../../entity/order';
import { ShopOrderService } from '../../service/order';

/**
 * 描述
 */
@CoolController({
  serviceApis: ['view'],
  entity: ShopOrderEntity,
  service: ShopOrderService,
})
export class OpenShopOrderController extends BaseController {}
