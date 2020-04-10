// 深拷贝 params:被赋予某个值的那个值
export function DeepCopy(params) {
  return JSON.parse(JSON.stringify(params))
}
