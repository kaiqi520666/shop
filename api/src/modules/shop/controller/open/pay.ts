import { CoolController, BaseController } from '@cool-midway/core';
import { ShopPayEntity } from '../../entity/pay';
import { ShopPayService } from '../../service/pay';

/**
 * 描述
 */
@CoolController({
  serviceApis: ['gereratePayOrder', 'gererateData', 'callback'],
  entity: ShopPayEntity,
  service: ShopPayService,
})
export class OpenShopPayController extends BaseController {}
