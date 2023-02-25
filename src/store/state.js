export default {
  baseLayout: {
    /* 用户标识 */
    token: window.localStorage.getItem('token') || '',
    /* 用户名称 */
    username: window.localStorage.getItem('RTX') || ''
  },
  /* 错误信息 */
  errorInfo: { code: '20000', message: 'successfully' }
};
