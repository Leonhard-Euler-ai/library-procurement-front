import request from '@/utils/request'

export function getBookCountPerClass() {
  return request({
    url: '/order/bookCountPerClass',
    method: 'get'
  })
}

export function getOrderList() {
  return request({
    url: '/order/orderList',
    method: 'get'
  })
}
