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
        let M = (date.getMonth() + 1) < 10 ? '0' + eval(date.getMonth() + 1) : date.getMonth() + 1
        let D = (date.getDate() < 10) ? '0' + date.getDate() : date.getDate()
        let h = (date.getHours() < 10) ? '0' + date.getHours() : date.getHours()
        let m = (date.getMinutes()) < 10 ? '0' + date.getMinutes() : date.getMinutes()
        let s = (date.getSeconds() < 10) ? '0' + date.getSeconds() : date.getSeconds()
        switch (language) {
            case "en":
                return Y + '-' + M + '-' + D + ' ' + h + ':' + m + ':' + s
            case "ch":
                return Y + '年' + M + '月' + D + '日'
            case "mix":
                return Y + '年' + M + '月' + D + '日' + ' ' + h + ':' + m + ':' + s
            case 'short' :
                return M + '月' + D + '日'
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
        const lists = []
        data.forEach((item) => {
            if (item[pidAttr] === pid) {
                item[attr] = this.setTree(data, item.id, attr, pidAttr)
                lists.push(item)
            }
        })
        return lists
    }
}
