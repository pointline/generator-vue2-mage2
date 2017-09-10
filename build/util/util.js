import makeDir from 'make-dir'
import fs from 'fs'
import gutil from 'gulp-util'
import moduleList from './moduleList'
import outputFileSync from 'output-file-sync'
import gulp from 'gulp'
import args from './args'
import config from '../../config'
import path from 'path'

/**
 * 工具类-主题目录
 */
class Util {
  /**
   * 初始化主题目录
   */
  static initDir () {
    let themes = config.themes
    for (let item of Object.keys(themes)) {
      let dir = `${themes[item].area}/${themes[item].src}`
      if (!this.isDir(dir)) {
        this.initConfigFile(dir, themes[item].name)
        for (let key in moduleList) {
          let moduleDir = `${dir}/Magento_${moduleList[key]}`
          this.initModule(moduleDir)
        }
      } else {
        gutil.log(gutil.colors.green(`主题目录已存在：${dir}`))
      }
    }
  }

  /**
   * 检查目录是否存在
   * @param dir
   * @returns true|false
   */
  static isDir (dir) {
    return fs.existsSync(dir)
  }

  /**
   * 创建目录
   * @param dir
   */
  static createDir (dir) {
    makeDir(dir).then(path => {
      gutil.log(gutil.colors.green(`目录创建成功：${dir}`))
    })
  }

  /**
   * 初始化模块目录
   * @param dir
   */
  static initModule (dir) {
    Promise.all([
      makeDir(`${dir}/layout`),
      makeDir(`${dir}/templates`),
      makeDir(`${dir}/web/images`),
      makeDir(`${dir}/web/components`),
      makeDir(`${dir}/web/modules`),
      makeDir(`${dir}/web/fonts`),
      makeDir(`${dir}/web/lib`)
    ]).then((path) => {
      gutil.log(gutil.colors.green(`模块创建成功：${dir}`))
    })

    gulp.src('./build/static/require-config.js').pipe(gulp.dest(`${dir}`))
  }

  /**
   * 初始化主题配置文件及所需资源
   * @param dir
   * @param themeName
   */
  static initConfigFile (dir, themeName) {
    let registration = fs.readFileSync('./build/static/registration.php', 'utf8')
    let registrationR = registration.replace(/ThemePath/, dir)
    outputFileSync(`${dir}/registration.php`, registrationR)

    let theme = fs.readFileSync('./build/static/theme.xml', 'utf8')
    let themeR = theme.replace(/ThemeName/, themeName)
    outputFileSync(`${dir}/theme.xml`, themeR)

    gulp.src('./build/static/etc/view.xml').pipe(gulp.dest(`${dir}/etc`))
    gulp.src('./build/static/media/preview.jpg').pipe(gulp.dest(`${dir}/media`))

    this.createDir(`${dir}/web/css/lib`)
    this.createDir(`${dir}/web/css/modules`)
    this.createDir(`${dir}/web/css/lib`)
    outputFileSync(`${dir}/web/css/main.sass`, '')
    this.createDir(`${dir}/web/images`)
    this.createDir(`${dir}/web/fonts`)

    gulp.src('./build/static/Magento_Theme/**').pipe(gulp.dest(`${dir}/Magento_Theme`))
  }

  /**
   * 获取当前主题路径
   * @returns {string}
   */
  static themeDir () {
    let currentTheme = args.theme
    if (currentTheme) {
      let theme = config.themes[args.theme]
      return `./${theme.area}/${theme.src}/`
    } else {
      return ''
    }
  }

  /**
   * 主题输出目录
   * @returns {*}
   */
  static outputDir () {
    let currentTheme = args.theme
    if (currentTheme) {
      let theme = config.themes[args.theme]
      return `${path.join(__dirname, '../../../')}app/design/${theme.area}/${theme.src}/`
    } else {
      return ''
    }
  }
}

export default Util
