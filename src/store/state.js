export default {
  baseLayout: {
    /* todo:用户标识 */
    token: window.localStorage.getItem('token') || '',
    /* todo:用户名称 */
    username: window.localStorage.getItem('RTX') || ''
  },
  /* todo:错误信息 */
  errorInfo: { code: '20000', message: 'successfully' }
};
