export default {
  /* todo:用户标识 */
  token: window.localStorage.getItem('token') || '',
  /* todo:系统主题 */
  theme: window.localStorage.getItem('theme') || 'primary',
  /* todo:访问文本颜色 */
  activeColor: '#FF69B4',
  /* todo:主题类型 */
  themeAttr: [{ theme: 'primary', color: '#FF69B4', text: 'Primary' }, { theme: 'default', color: '#409EFF', text: 'Default' }]
};
