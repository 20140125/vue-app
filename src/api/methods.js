import request from '../tools/request.js'
import qs from 'qs'

const access_token = {'token': localStorage.getItem('token')}
/**
 * todo:POST方法
 * @param url
 * @param params
 * @return {Promise<AxiosResponse<any>>}
 * @private
 */
const __commonMethods = async function(url, params = {}) {
    return request.post(url, qs.stringify(Object.assign(params, access_token)))
}
/**
 *
 * @type {{
 * __commonMethods: (function(*=, *=): Promise<AxiosResponse<any>>)
 * }}
 * @private
 */
const __methods = {
    __commonMethods
}

export default __methods
