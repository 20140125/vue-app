import request from '@/tools/request.js';

/**
 * POST方法
 * @param url
 * @param params
 * @return {Promise<any>}
 */
const commonMethods = async function (url, params = {}) {
  return request.post(url, params);
};

export { commonMethods };
