/**
 * 配置信息检查
 * @param rule
 * @param value
 * @param callback
 */
export const checkConfigChildren = (rule, value, callback) => {
  try {
    let err = 0;
    value.forEach(item => {
      if (!item.value || !item.name) {
        err += 1;
      }
    });
    if (err > 0) {
      callback(new Error('键值对不能为空'));
    }
    callback();
  } catch (e) {
    callback(new Error('配置属性错误'));
  }
};
