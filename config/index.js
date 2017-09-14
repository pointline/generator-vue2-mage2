import themes from './themes'

/**
 * 网站配置
 * proxy 需要代理网站的URL
 * browser 指定从哪个浏览器打开网站
 * @type {{proxy: string, browser: [string,string]}}
 */
const siteConfig = {
  proxy: '',
  browser: ["google chrome", "firefox"]
}

export default {
  themes,
  siteConfig
}
