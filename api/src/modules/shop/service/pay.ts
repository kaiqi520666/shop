import { Init, Provide } from '@midwayjs/core';
import { BaseService } from '@cool-midway/core';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
import { ShopPayEntity } from '../entity/pay';
import { snowflake } from '../../../comm/snowflake';
import { sign as _sign, constants, verify as _verify } from 'crypto';
import { makeHttpRequest } from '@midwayjs/core';
import { faker } from '@faker-js/faker';
import { generateRandomId } from '../../../comm/userId';

/**
 * 描述
 */
@Provide()
export class ShopPayService extends BaseService {
  @InjectEntityModel(ShopPayEntity)
  shopPayEntity: Repository<ShopPayEntity>;

  @Init()
  async init() {
    await super.init();
    this.setEntity(this.shopPayEntity);
  }
  async gererateData() {
    const data = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      partnerUserId: generateRandomId(),
    };
    return data;
  }

  /**
   * 描述
   */
  async gereratePayOrder(params: any) {
    let callBackFailUrl = `https://shop.fdshop.top/payment/fail/${params.uid}`;
    let callBackUrl = `https://shop.fdshop.top/payment/success/${params.uid}`;
    let notifyUrl = 'https://notify.fdshop.top/open/shop/pay/callback';
    // if (process.env.NODE_ENV === 'local') {
    //   callBackFailUrl = 'http://127.0.0.1:3000/api/pay/callback';
    //   callBackUrl = 'http://127.0.0.1:3000/api/pay/callback';
    //   notifyUrl = 'http://127.0.0.1:3000/api/pay/notify';
    // }
    const uid = snowflake();
    const map = {
      appId: 2027,
      orderId: uid,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      amount: params.total,
      currency: 'USD',
      callBackUrl,
      callBackFailUrl,
      notifyUrl,
      subject: params.title,
      region: 'US',
      partnerUserId: generateRandomId(),
    };
    const data = this.getData(map, 'v64y0V5f6S7hWCy2z259Pz1w61HEpGTW');

    const sign = this.gererateSign(data);
    const body = {
      ...map,
      sign,
    };
    const res = await makeHttpRequest(
      'https://uat-interface.haipay.asia/global/cashier/collect/apply',
      {
        method: 'POST',
        data: body,
        dataType: 'json',
        contentType: 'json',
      }
    );
    console.log('body:', body);
    console.log('result:', res.data);

    await this.shopPayEntity.insert({
      orderId: params.orderId,
      ip: params.ip,
      uid: BigInt(uid),
      status: 0,
    });

    return res.data;
  }
  getData(map: any, merchantSecretKey: string) {
    try {
      // 提取键并按字母顺序排序
      const keys = Object.keys(map).sort();

      // 构造签名键值对的格式
      const sb = keys
        .reduce((acc, key) => {
          const val = map[key];
          if (val !== '' && val !== null && key !== 'sign') {
            acc.push(`${key}=${val}`);
          }
          return acc;
        }, [])
        .join('&');

      // 加入商户密钥
      const result = `${sb}&key=${merchantSecretKey}`;

      return result;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  gererateSign(data: string) {
    const pub = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA1j5brpABxnEn8Q3NlhSg+U7yc7brT+ZEc4iFKirv3wjKft4W1/ejLnXur7+2rthEsI/ZnVoU7JXD6mHeTVuT5n1ukWl1IUMYz8L+Pxw6MOS4gG8L6PzNL8Rm4Hv6ESF0dwR+yRImCxGjP+8m4T7lsjYELK+cJEKh0aq98+OVCe8xkPH0HDagdzzLMQcMWjDBKIFlMYsjY1VYmnhruY1dwpUu0YTW5b27MtTg8VmcDDtoT0Sz0afUpEPqm6CRbHYvY3qaGZlyMULG1uINwuPx9Uncvz4DQNgjQnvUQy4zDuNuyTCGXR7fHDY1CWoxkJW7Q6FyJB9AS0AG4ZWnQTwUGwIDAQAB
-----END PUBLIC KEY-----`;

    const pri = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDWPluukAHGcSfxDc2WFKD5TvJztutP5kRziIUqKu/fCMp+3hbX96Mude6vv7au2ESwj9mdWhTslcPqYd5NW5PmfW6RaXUhQxjPwv4/HDow5LiAbwvo/M0vxGbge/oRIXR3BH7JEiYLEaM/7ybhPuWyNgQsr5wkQqHRqr3z45UJ7zGQ8fQcNqB3PMsxBwxaMMEogWUxiyNjVViaeGu5jV3ClS7RhNblvbsy1ODxWZwMO2hPRLPRp9SkQ+qboJFsdi9jepoZmXIxQsbW4g3C4/H1Sdy/PgNA2CNCe9RDLjMO427JMIZdHt8cNjUJajGQlbtDoXIkH0BLQAbhladBPBQbAgMBAAECggEAEnatUA35GTEHUC7wWM7OUK4NFwvcm7YskAhj8Y5hvcb0LJrXPSWKWqavO1Y6WDcrNEwxZO4uf3UovTpR/ji2Nlb5AG8mOQefS8hyQN4d5bjQbcEkNaATztoOQ6prkq5fayJoCswVmz6Z4xipMSBKi2E8Wt2Hh1h2uasNU8d5QLHEJQg4lDycF3AouZR4oQoKEEaCROhdeM5IVuu62r348SpjgoqX1MS350WQkjDVZy1OVDE2NBfSWMdPUKEQjTF2JtBNrx/5Kr90lNTcU+3bx3ONRFNkOk+KsUNB2OF/dO/4QB5IdJWmycCHwhzl26psxBK/b2y8NwbT82LX46p7gQKBgQDtdQrijF9mfIG0jeIxvVOsgkUSpYCAtr2esDvopt+vbDNP16HyPUC92/1+swy1Efx827ExbN2sHemGy6CSu6eMp41tq0+jXLvu+JJCxl8HjS760JL0AfBVox9jcAhpd8rcAeXLniCv7iFskLuuybuoBgEz9guoKbJu89Ae+UJTJQKBgQDm+UHUFFHFww80p59Qkpb0/2krl+NdudbEjqzW532mZi+ekkRTpQTBVA4k+VdvrfnGZdFoC62VR4wQDaA2nGj0TtodOi3fv9R4q9gUj0aPg7GDTDDWDt7ft2LToPTSAEcdSkJdEE1xM40Zk02yQKy61TenPMEeH/b6GEBOsb/GPwKBgB1Uiq6nBhWjpWXG7LyWFSLGyH9gH/pGGC/kttGq4xBI/iGLkf5Y4IlTBgHDXftzqEtH26AuQUdEPpceycu2ECEIhSiZs3GLP89ptq82z4AgSUBDyRMItkXtqy/eI7vbRxxbw6Wd942jjU9apUQWuO4tJ7LiXlg8JkUcKoXY5f9dAoGADBhxghGuVpTobvF4Plfu39WgRFAn7/iTbqeqFXb59YTUaZFvUpIJtbYZJ4aHNan+so0SckhqRq8Afra39SQrut+GPJGXZWg+UDNvlWQLZeiXmzCaPht5QG3yFvMO3xB0qOwCna0E4TC56uTz5KnOYdpYl8Fuu40g+efbNkPIrzECgYEAxsk6pnBoVCzzbfM3CyorA1iHKTUUuceS9iAnES0tdciR+QJH1CFZiyK93JIUIubXUeSV2FvBJ2v1OqjoiWeULkHqPO3tZXJDjOYFB6v3wvjKJmGE+27jXCyvVgnrGmyOP6vlhhOlVM0lc5YrZP5U9tO4Rsk5yPp6PuaWC0JgGSg=
-----END PRIVATE KEY-----`;

    // 将字符串格式的密钥转换为Buffer对象
    const privateKeyBuffer = Buffer.from(pri, 'utf-8');
    const publicKeyBuffer = Buffer.from(pub, 'utf-8');

    // 使用私钥对数据进行签名
    const sign = _sign('sha256', Buffer.from(data), {
      key: privateKeyBuffer,
      padding: constants.RSA_PKCS1_PADDING,
    });

    console.log('Signature:', sign.toString('base64'));

    // 使用公钥验证签名
    const verify = _verify(
      'sha256',
      Buffer.from(data),
      {
        key: publicKeyBuffer,
        padding: constants.RSA_PKCS1_PADDING,
      },
      sign
    );

    console.log('Verification result:', verify);
    return sign.toString('base64');
  }
  async callback(params: any) {
    console.log('params:', params);
    await this.shopPayEntity.update(
      {
        uid: BigInt(params.orderId),
      },
      {
        status: params.status,
        appId: params.appId,
        orderNo: params.orderNo,
        currency: params.currency,
        originalCurrency: params.originalCurrency,
        fee: params.fee,
      }
    );
    return params;
  }
}
