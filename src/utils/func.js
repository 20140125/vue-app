import store from '../store';
import router from '../route';
import request from '../tools/request';

/**
 * todo:设置时间
 * @param timestamp
 * @param language
 * @return {string}
 */
export function setTime(timestamp, language = 'en') {
  const date = new Date(timestamp);
  const Y = date.getFullYear();
  const M = (date.getMonth() + 1) < 10 ? `0${(date.getMonth() + 1)}` : date.getMonth() + 1;
  const D = (date.getDate() < 10) ? `0${date.getDate()}` : date.getDate();
  const h = (date.getHours() < 10) ? `0${date.getHours()}` : date.getHours();
  const m = (date.getMinutes()) < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  const s = (date.getSeconds() < 10) ? `0${date.getSeconds()}` : date.getSeconds();
  switch (language) {
    case 'en':
      return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s;
    case 'ch':
      return Y + '年' + M + '月' + D + '日' + ' ' + h + ':' + m + ':' + s;
    case 'date':
      return Y + '年' + M + '月' + D + '日';
    case 'time' :
      return h + ':' + m + ':' + s;
  }
}
/**
 * todo：设置树形结构
 * @param data
 * @param pid
 * @param attr
 * @param pidAttr
 * @return {*[]}
 */
export function setTree(data, pid = 0, attr = '__children', pidAttr = 'pid') {
  const lists = [];
  data.forEach((item) => {
    if (item[pidAttr] === pid) {
      item[attr] = setTree(data, item.id, attr, pidAttr);
      lists.push(item);
    }
  });
  return lists;
}
/**
 * todo:滚动到底部
 * @param selector
 * @return {number}
 */
export function scrollToBottom(selector) {
  setTimeout(() => {
    const domWrapper = document.querySelector(selector);
    domWrapper.scrollTop = domWrapper.scrollHeight;
  }, 10);
}

/**
 * todo:返回顶部
 * @param speed 配速
 * @param timeout 定时器执行时间
 */
export function scrollToUp(speed, timeout) {
  /* 每次开启定时器都重新计算速度 */
  const timer = setInterval(function () {
    /* 获取滚动条的滚动高度 */
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    /* 用于设置速度差，产生缓动的效果 */
    document.documentElement.scrollTop = document.body.scrollTop = scrollTop + Math.floor(-scrollTop / speed);
    if (scrollTop === 0) {
      clearInterval(timer);
    }
  }, timeout);
}
/**
 * todo:像素转换
 * @param val
 * @return {string}
 */
export function rgbToHex(val) {
  const color = [];
  let r = 0;
  let g = 0;
  let b = 0;
  let a = 0;
  for (let i = 0; i < val.length; i += 4) {
    if (i + 4 < val.length) {
      r += parseInt(val[i], 10);
      g += parseInt(val[i + 1], 10);
      b += parseInt(val[i + 2], 10);
      a += parseInt(val[i + 3], 10);
    }
  }
  let len = val.length / 4;
  let rgba = [Math.ceil(r / len), Math.ceil(g / len), Math.ceil(b / len), Math.ceil(a / len)];
  let digits = '0123456789abcdef'.split('');
  rgba.forEach((item) => {
    let base16 = parseInt(item > 30 ? (item - 30).toString() : item).toString(16);
    digits.includes(base16) ? color.push('0' + base16) : color.push(base16);
  });
  return '#' + color.join('');
}

/**
 * todo:删除tab标签
 * @param item
 */
export function removeTabs(item) {
  store.state.home.tabs.forEach((tab, index) => {
    if (tab.value === item) {
      const nextTab = store.state.home.tabs[index + 1] || store.state.home.tabs[index - 1];
      if (nextTab) {
        store.dispatch('home/deleteTabs', { index, nextTab }).then(() => router.push({ path: nextTab.value }));
      }
    }
  });
}
/**
 * todo:base64图片上传
 * @param fileUrl 上传的图片地址
 * @param images 图片资源
 * @param imagesName 图片名称
 */
export function toUploadNewFile(fileUrl, images, imagesName) {
  /* 生成二进制流上传图片 */
  const arr = images.split(',');
  const mime = ((arr[0] || []).match(/:(.*?);/) || [])[1];
  const bstr = atob(arr[1] || []);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n) {
    n -= 1;
    u8arr[n] = bstr.charCodeAt(n);
  }
  const file = new File([u8arr], fileUrl, { type: mime });
  file.uid = new Date().getTime();
  /* 创建form对象 */
  const param = new FormData();
  param.append('file', file);
  param.append('filename', `${imagesName}.png`);
  /* 添加请求头 */
  const config = { headers: { 'Content-Type': 'multipart/form-data', 'Authorization': store.state.baseLayout.token } };
  request.post(this.action, param, config).then((response) => {
    return response;
  });
}

/**
 * todo:函数节流
 * @param fn
 * @param delay
 * @returns {(function(): void)|*}
 */
export function debounce(fn, delay) {
  let timer;
  return function () {
    const _this = this;
    const args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(function () {
      fn.apply(_this, args);
    }, delay);
  };
}

/**
 * todo:滚动条是否触底
 * @returns {boolean}
 */
export function scrollBottom0() {
  /* 滚动视口高度(也就是当前元素的真实高度) */
  const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight;
  /* 可见区域高度 */
  const clientHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
  /* 滚动条顶部到浏览器顶部高度 */
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
  /* 滚动条是否触底 */
  return clientHeight + Math.ceil(scrollTop) >= scrollHeight;
}
