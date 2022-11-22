import request from '@/tools/request.js';

/**
 * todo:POST方法
 * @param url
 * @param params
 * @returns {Promise<AxiosResponse<any>>}
 */
const commonMethods = async function (url, params = {}) {
  return request.post(url, params);
};

export { commonMethods };
