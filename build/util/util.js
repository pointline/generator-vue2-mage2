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
 * 工具类-目录
 */
class Util {
  /**
   * 初始化目录
   * @param themes 主题配置文件
   */
  static initDir (themes) {
    for (let item of Object.keys(themes)) {
      let dir = `${themes[item].area}/${themes[item].src}`
      if (!this.isDir(dir)) {
        this.createConfigFile(dir, themes[item].name)
        for (let key in moduleList) {
          let moduleDir = `${dir}/Magento_${moduleList[key]}`
          this.createThemeDir(moduleDir)
        }
      } else {
        gutil.log(gutil.colors.green(`目录已存在：${dir}`))
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
   * @constructor
   */
  static createDir (dir) {
    makeDir(dir).then(path => {
      gutil.log(gutil.colors.green(`创建成功：${dir}`))
    })
  }

  /**
   * 创建主题目录
   * @param dir
   * @constructor
   */
  static createThemeDir (dir) {
    Promise.all([
      makeDir(`${dir}/layout`).then(path => {
        gutil.log(gutil.colors.green(`创建成功：${dir}/layout`))
      }),
      makeDir(`${dir}/templates`).then(path => {
        gutil.log(gutil.colors.green(`创建成功：${dir}/templates`))
      }),
      makeDir(`${dir}/web/images`).then(path => {
        gutil.log(gutil.colors.green(`创建成功：${dir}/web/images`))
      }),
      makeDir(`${dir}/web/components`).then(path => {
        gutil.log(gutil.colors.green(`创建成功：${dir}/web/components`))
      }),
      makeDir(`${dir}/web/modules`).then(path => {
        gutil.log(gutil.colors.green(`创建成功：${dir}/web/modules`))
      }),
      makeDir(`${dir}/web/fonts`).then(path => {
        gutil.log(gutil.colors.green(`创建成功：${dir}/web/fonts`))
      }),
      makeDir(`${dir}/web/lib`).then(path => {
        gutil.log(gutil.colors.green(`创建成功：${dir}/web/lib`))
      })
    ])

    gulp.src('./build/static/require-config.js').pipe(gulp.dest(`${dir}`))
  }

  /**
   * 创建主题配置文件及所需资源
   * @param dir
   * @param themeName
   */
  static createConfigFile (dir, themeName) {
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
  static currentDir () {
    let currentTheme = args.theme
    if (currentTheme) {
      let theme = config.themes[args.theme]
      return `./${theme.area}/${theme.src}/`
    } else {
      return ''
    }
  }

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
