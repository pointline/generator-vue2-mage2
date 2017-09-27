/**
 * 主题配置
 * default: { // 主题唯一标识
 *   name: 'Default name', // 主题名
 *   src: 'Default/default', // 主题放置路径，注意首字母大写
 *   extraModulesList: [], // 额外生成的模块，填写模块名
 *   includeJsLib: [], // 引入额外的JS库,填写js文件名
 *   excludeShallow: [], // 浅移除，不合并到模块中，作为一个http加载,填写js文件名
 *   proxyTable: { // 设置api路由代理
 *    '/api/header': { // 代理路由为此URL
 *      target: 'http://infin2.mez100.cn:8035/rest/V1/xmapi/header' // 需要代理的路由
 *    }
 *   }
 * }
 * @type {{point: {name: string, src: string, extraModulesList: Array, includeJsLib: [string,string], excludeShallow: [string,string], proxyTable: {/api/header: {target: string}}}}}
 */
const themes = {
  // point: {
  //   name: 'Point name',
  //   src: 'Pointline/point',
  //   extraModulesList: [],
  //   includeJsLib: ['html5shiv.min', 'respond.min'],
  //   excludeShallow: ['vue', 'modernizr.min'],
  //   proxyTable: {
  //     '/api/header': {
  //       target: 'http://infin2.mez100.cn:8035/rest/V1/xmapi/header'
  //     }
  //   }
  // }
}

export default themes
