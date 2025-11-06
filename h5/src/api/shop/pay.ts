import request from '@/request'

export async function gereratePayOrder(order: any) {
  return await request.post('/open/shop/pay/gereratePayOrder', order)
}
