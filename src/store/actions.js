import requestMethod from '@/api/methods'

export default {
    /**
     * todo:通用方法（添加、修改、删除）
     * @param commit
     * @param payload
     * @return {Promise<unknown>}
     * @constructor
     */
    UPDATE_ACTIONS({ commit }, payload) {
        return new Promise((resolve, reject) => {
            requestMethod.__commonMethods(payload.url, payload.model).then(result => {
                resolve(result)
            }).catch(error => {
                commit('UPDATE_MUTATIONS', { error: error })
                reject(error)
            })
        })
    }
}
