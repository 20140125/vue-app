import request from '@/tools/request.js';

/**
 * todo:POST方法
 * @param url
 * @param params
 * @return {Promise<AxiosResponse<any>>}
 * @private
 */
const __commonMethods = async function (url, params = {}) {
    return request.post(url, params);
};
/**
 *
 * @type {{
 * __commonMethods: (function(*=, *=): Promise<AxiosResponse<any>>)
 * }}
 * @private
 */
const __methods = {
    __commonMethods
};

export default __methods;
