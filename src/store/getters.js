export default {
  /* todo:获取主题 */
  theme(state) {
    return state.theme || 'primary'
  },
  /**
   * todo:文案颜色
   * @param state
   * @return {string}
   */
  activeColor(state) {
    let color = '';
    state.themeAttr.forEach((item) => {
      if (item.theme === state.theme) {
        color = item.color;
      }
    })
    return color;
  }
}
