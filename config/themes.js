/**
 * 主题配置
 * default: { // 主题唯一标识
 *   name: 'Default name', // 主题名
 *   area: 'frontend', // 主题区域 frontend
 *   src: 'Default/default', // 主题放置路径
 *   excludeShallow: [] // 浅移除，不合并到模块中，作为一个http加载
 * }
 * @type {{point: {name: string, area: string, src: string}, white: {name: string, area: string, src: string, excludeShallow: [string]}}}
 */
const themes = {
  point: {
    name: 'Point name',
    area: 'frontend',
    src: 'Pointline/point'
  },
  white: {
    name: 'White name',
    area: 'frontend',
    src: 'White/point',
    extraModulesList: [],
    excludeShallow: ['lib/vue'],
  }
}

export default themes
