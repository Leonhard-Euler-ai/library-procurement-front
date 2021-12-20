import request from '@/utils/request'

export function getOrderList() {
  return request({
    url: '/order/orderList',
    method: 'get'
  })
}

export function generateOrder(orderBookList) {
  return request({
    url: '/order/generate',
    method: 'post',
    data: orderBookList
  })
}

export function getOrderDetailList(orderId) {
  return request({
    url: '/order/orderDetailList',
    method: 'get',
    params: { orderId }
  })
}

export function orderPaySuccess(orderId) {
  return request({
    url: '/order/paySuccess',
    method: 'post',
    params: { orderId }
  })
}
