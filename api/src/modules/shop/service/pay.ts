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
      appId: 1796,
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
    const data = this.getData(map);

    const sign = this.gererateSign(data);
    const body = {
      ...map,
      sign,
    };

    console.log('body:', body);
    const res = await makeHttpRequest(
      'https://api.haipay.top/global/cashier/collect/apply',
      {
        method: 'POST',
        data: body,
        dataType: 'json',
        contentType: 'json',
        timeout: 10000,
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
  getData(map: any) {
    const merchantSecretKey = 'aL5P026l9DRC16M9qjkQrhd66Y92nG0m';
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
    const pri = `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQClYcGuKZ+iaclifr2V57RT+KoBatooGp00P6R1WPrMs8w7WSXG/efihENrFK0P3ECA5Udkoi7OEPe7uoU03qOPUomA5mla3fjIxf3JGKxsz/EYVxTpClhaBlfAyBUw692auD+8GmdaKpfAPcR/iTV969PG5zsyp7/fESZFvHGQ5By78BV3VJTQIHkW2I+cON168IPNdwq3cMBb8frcHsfC0IuvqyT19kHdxEkXKzmI8f071qiJihj+Glm0493hThMWmu+tS9yYNlRmCCCgnUEkkxgIa+AMhl0poDyrCNXo/bQsb4fYBprueJ7FX2ZRY3SFIv0s/WYBzbUdulln3VMdAgMBAAECggEANIDygh5IxcEb5B8khSDISRhasJSBqdW5Lss9pNuY08AJCJZmveQB6BHhbW9k+fIMsF8Z6ULr5RPR8lFm1MAR4QBtEvUTYXuy7dqdlWg15V2mxvludAWKwxncZiGfSKa49dOkuE0RnriC8M8rQOoIh2+FDlJ+orhK28CQC/elfj/JiS1Za+UZU+1QaFZ+d8wbSnIkzPmM5nDAyndrwwVWnYa+QPKdtAQONU4dpT7i4e0XbqI0nAKHWAUDiYwl9yRUC3+E45UTfInzH1LZWfAxaMKeXzqWJ0OustZaFPG5F6lKMvomSfZUdvpSXfgByTz81i3m1HW2DfoVFc7cMvuFgQKBgQDpUPQVfz5m2K/fhXpECLFwYqhH9OtW+mWHS0hHoeSpz8sICZJbSSzQtkNfOQ6PI9b1JnIwujpF2PSjCChb5b0MZktX1T1ts5cjWbnbaX3NJu9Dads2t4Wyq5GiadoZZZ6lRpHbBVO8VnTqWtVTLjSrOz9CQWgGRHPL/HfJDtQwsQKBgQC1dfkv6lL/BqPOO945SesmcArSHWuEGM/5wfA5gmoIpwn+5BMLyiXFAKruzBFLhR8M9ZpelWtLq3R3La8JjvduY+IIRANrjRKPNVP+7KOh2VFar+0+1EdXaI+jGP/oBzfCrsnM9chSmxSxSY9FJpgCqSns2JRI7n4FxnsQfC4ELQKBgEwQfmL7xuZUwpHGvGOtydtv7pj2+jqzC6KeIoRn/Vp3SiPmqvZj1t58bV6ABYUZFB18WUIVlKXs42S7Zhz/uzBtsSaDeLFpGV8HA5bKv57AkMSToEoobsgfMy2WAOrCvIP5i9ex1ujR7u/wiRfDOpyQhkEdfcJ9UpswRgUgdoEhAoGAEeaGY2ypLVE5XYHYZSxejxckah/O2GQeOBQin3m2/g2EVemn21TgrvNm6VGmLx39tyiPRt9Ui01pmswd5UJ+NByUUp5q+/QZrZjkJVSwu6mVde2+6KDGPOAqszsnG3uCy6i0bYyda1CzFN4dzQOGoVSQtzWSQzOLqQQwZarqWy0CgYAph45b7ECQR0rO1V1BqjiRH5ObX24vbAQ8K5pV5XVxjCcACcERjRS0l8KE46fcQ+uL0mOwOrAWgJ4GETZq4LjsO24B7NbstJ22RE9/p6l4H/Dkf5niDbQIoSpv/Tpvp3PS3OFNj7jhpmhlyV9sxH3JK2GDdBSbwyVsi0h6GhgQow==
-----END PRIVATE KEY-----`;

    // 将字符串格式的密钥转换为Buffer对象
    const privateKeyBuffer = Buffer.from(pri, 'utf-8');

    // 使用私钥对数据进行签名
    const sign = _sign('sha256', Buffer.from(data), {
      key: privateKeyBuffer,
      padding: constants.RSA_PKCS1_PADDING,
    });

    return sign.toString('base64');
  }
  checkSign(params: any) {
    const pub = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2mphnVeSmqyrlB14RimNw4qqIasErBMaYFpj9liMeoke64eKjlHN9gYJq0c/QrzDt0EU3aVfp2z0hKgiendC0HUryUEv9B5LeXUn+iTvaRKUKC95YbHZVQ7iRwNkHcoVi91L/toMz3J6jFWyqrswZ+HaTakqPt7kdhsHQFtsyELoaRGZmBLq8WGkBbMU1HvhKPfFVWpplU1pV5tKiEHyYZFCmvTkpcone+snO+I5hywp1cTA0oB96et3sHVdPAtArp1tPYR4NnQ9r8hBYFN4NiE/Hi3mYxHZww47NZrllH9FlFxtFNTDHVHVn8ktZM+5O2nDCwy1GKuD58d0oJ8oHQIDAQAB
-----END PUBLIC KEY-----`;
    const data = this.getData(params);
    const publicKeyBuffer = Buffer.from(pub, 'utf-8');
    // 使用公钥验证签名
    const verify = _verify(
      'sha256',
      Buffer.from(data),
      {
        key: publicKeyBuffer,
        padding: constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(params.sign, 'base64')
    );
    return verify;
  }
  async callback(params: any) {
    console.log('params:', params);
    console.log('check:', this.checkSign(params));
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
