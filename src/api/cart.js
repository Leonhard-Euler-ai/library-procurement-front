import request from '@/utils/request'

export function addCartBook(bookId, bookCount) {
  return request({
    url: '/cart/addBook',
    method: 'post',
    params: {
      bookId,
      bookCount
    }
  })
}

export function addBatchBooks(bookList) {
  return request({
    url: '/cart/addBatchBooks',
    method: 'post',
    data: bookList
  })
}

export function getCartBookList() {
  return request({
    url: '/cart/bookList',
    method: 'get'
  })
}

export function deleteCartBook(bookId) {
  return request({
    url: '/cart/deleteBook',
    method: 'post',
    params: { bookId }
  })
}

export function clearCart() {
  return request({
    url: '/cart/clear',
    method: 'delete'
  })
}

export function resetCartBookCount(bookId, bookCount) {
  return request({
    url: '/cart/resetBookCount',
    method: 'post',
    params: { bookId, bookCount }
  })
}
