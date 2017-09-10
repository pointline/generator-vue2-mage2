/**
 * 主题配置
 * default: { 主题唯一标识
 *   name: 'Default name', 主题名
 *   area: 'frontend', 主题区域 frontend
 *   src: 'Default/default' 主题放置路径
 * },
 * @type {{point: {name: string, area: string, src: string}}}
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
    excludeShallow: ['lib/vue']
  }
}

export default {
  themes
}
