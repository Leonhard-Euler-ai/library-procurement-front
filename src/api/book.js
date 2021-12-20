import request from '@/utils/request'

export function getAllBooks() {
  return request({
    url: '/book/all',
    method: 'get'
  })
}

export function getBookById(bookId) {
  return request({
    url: '/book/bookId',
    method: 'get',
    params: { bookId }
  })
}

export function searchBook(keyword, searchType) {
  return request({
    url: '/book/like/bookName',
    method: 'get',
    params: { keyword, searchType }
  })
}

export function getPageBook(pageNum, pageSize) {
  return request({
    url: '/book/pageList',
    method: 'get',
    params: { pageNum, pageSize }
  })
}

export function getAllBooksCount() {
  return request({
    url: '/book/total',
    method: 'get'
  })
}
