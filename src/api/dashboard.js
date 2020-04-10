import request from '@/utils/request'

export function getContent(data) {
  return request({
    url: '/pandect/content',
    method: 'post',
    data
  })
}
