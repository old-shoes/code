// 防抖函数，直接传入所有参数
const debounce = (function() {
  let timer = null
  return function() {
    if (timer !== null) clearTimeout(timer)
    timer = setTimeout(...arguments);
  }
})()