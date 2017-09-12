/**
 * 主题配置
 * default: { // 主题唯一标识
 *   name: 'Default name', // 主题名
 *   src: 'Default/default', // 主题放置路径
 *   extraModulesList: [], // 额外生成的模块
 *   includeJsLib: [], // 引入额外的JS库
 *   excludeShallow: [] // 浅移除，不合并到模块中，作为一个http加载
 * }
 * @type {{point: {name: string, src: string, extraModulesList: Array, includeJsLib: [string,string], excludeShallow: [string]}}}
 */
const themes = {
  // point: {
  //   name: 'Point name',
  //   src: 'Pointline/point',
  //   extraModulesList: [],
  //   includeJsLib: ['html5shiv.min', 'respond.min'],
  //   excludeShallow: ['lib/vue']
  // }
}

export default themes
