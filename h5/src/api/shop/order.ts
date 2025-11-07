import request from '@/request'

export async function getOrderData(uid: string) {
  return await request.post('/open/shop/order/view', { uid })
}

export async function getIp() {
  return await request.get('https://icanhazip.com/')
}
