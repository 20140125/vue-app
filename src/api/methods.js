import request from '../tools/request.js';

/**
 * todo:POST方法
 * @param url
 * @param params
 * @return {Promise<AxiosResponse<any>>}
 * @private
 */
const commonMethods = async function (url, params = {}) {
  return request.post(url, params);
};
/**
 *
 * @type {{
 * commonMethods: (function(*=, *=): Promise<AxiosResponse<any>>)
 * }}
 * @private
 */
const __methods = {
  commonMethods
};

export default __methods;
