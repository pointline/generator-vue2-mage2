import themes from './themes'

/**
 * 网站配置
 * proxy 需要代理网站的URL
 * browser 指定从哪个浏览器打开网站,默认chrome
 * @type {{proxy: string, browser: [string,string]}}
 */
const siteConfig = {
  proxy: '',
  browser: ["google chrome"]
}

export default {
  themes,
  siteConfig
}
