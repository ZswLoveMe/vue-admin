import request from '@/utils/request'

export function getAllArticle(data) {
  return request({
    url: '/article/getAllArticle',
    method: 'post',
    data
  })
}
export function delArticle(data) {
  return request({
    url: '/article/delArticle',
    method: 'post',
    data
  })
}

export function getArticle(data) {
  return request({
    url: '/article/getArticle',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: '/article/updateArticle',
    method: 'post',
    data
  })
}

export function addArticle(data) {
  return request({
    url: '/article/addArticle',
    method: 'post',
    data
  })
}

export function getCategories(data) {
  return request({
    url: '/article/getCategories',
    method: 'post',
    data
  })
}

export function getCategoriesById(data) {
  return request({
    url: '/article/getCategoriesById',
    method: 'post',
    data
  })
}

export function updateCategories(data) {
  return request({
    url: '/article/updateCategories',
    method: 'post',
    data
  })
}

export function addCategories(data) {
  return request({
    url: '/article/addCategories',
    method: 'post',
    data
  })
}

