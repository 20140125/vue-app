export default {
  /**
   * todo:设置时间
   * @param timestamp
   * @param language
   * @return {string}
   */
  setTime(timestamp, language = 'en') {
    let date = new Date(timestamp);
    let Y = date.getFullYear();
    let M = (date.getMonth() + 1) < 10 ? `0${(date.getMonth() + 1)}` : date.getMonth() + 1;
    let D = (date.getDate() < 10) ? `0${date.getDate()}` : date.getDate();
    let h = (date.getHours() < 10) ? `0${date.getHours()}` : date.getHours();
    let m = (date.getMinutes()) < 10 ? `0${date.getMinutes()}` : date.getMinutes();
    let s = (date.getSeconds() < 10) ? `0${date.getSeconds()}` : date.getSeconds();
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
  },
  /**
   * todo：设置树形结构
   * @param data
   * @param pid
   * @param attr
   * @param pidAttr
   * @return {*[]}
   */
  setTree(data, pid = 0, attr = '__children', pidAttr = 'pid') {
    const lists = [];
    data.forEach((item) => {
      if (item[pidAttr] === pid) {
        item[attr] = this.setTree(data, item.id, attr, pidAttr);
        lists.push(item);
      }
    });
    return lists;
  },
  /**
   * todo:滚动到底部
   * @param selector
   * @return {number}
   */
  scrollToBottom(selector) {
    setTimeout(() => {
      const domWrapper = document.querySelector(selector);
      domWrapper.scrollTop = domWrapper.scrollHeight;
    }, 10);
  },
  /**
   * todo:返回顶部
   */
  scrollToUp() {
    /* 每次开启定时器都重新计算速度 */
    let timer = setInterval(function() {
      /* 获取滚动条的滚动高度 */
      let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
      /* 用于设置速度差，产生缓动的效果 */
      let speed = Math.floor(-scrollTop / 8.888);
      /* 用纯数字赋值 */
      document.documentElement.scrollTop = document.body.scrollTop = scrollTop + speed;
      if (scrollTop === 0) {
        clearInterval(timer);
      }
    }, 50);
  },
  /**
   * todo:像素转换
   * @param val
   * @return {string}
   */
  rgbToHex(val) {
    let color = [];
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
};
