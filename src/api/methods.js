import request from '@/tools/request.js';

/**
 * POST方法
 * @param url
 * @param params
<<<<<<< HEAD
 * @return {Promise<any>}
 * @private
=======
 * @returns {Promise<AxiosResponse<any>>}
>>>>>>> 0fb240ba0490862f8cf4bd1e126f2a1c1366d376
 */
const commonMethods = async function (url, params = {}) {
  return request.post(url, params);
};

export { commonMethods };
