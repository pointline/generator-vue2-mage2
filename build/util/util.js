import makeDir from 'make-dir'
import fs from 'fs'
import gutil from 'gulp-util'
import modulesList from './modulesList'
import outputFileSync from 'output-file-sync'
import gulp from 'gulp'
import args from './args'
import config from '../../config'
import path from 'path'
import requireDirectory from 'require-directory'
import _ from 'lodash'
import shell from 'gulp-shell'
import os from 'os'

/**
 * 工具类
 */
class Util {
  /**
   * 初始化主题目录
   */
  static initDir () {
    let themeDir = this.themeDir()
    if (!this.isDir(themeDir)) {
      this.initConfigFile(themeDir, this.currentThemeName())
      let totalModules = [...modulesList, ...this.extraModulesList()]
      for (let key in totalModules) {
        let moduleDir = `${themeDir}${this.ds()}Magento_${totalModules[key]}`
        this.initModule(moduleDir)
      }
    } else {
      gutil.log(gutil.colors.red(`主题目录已存在：${themeDir}`))
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
      makeDir(`${dir}/web/components`),
      makeDir(`${dir}/web/modules`),
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
    let registrationR = registration.replace(/ThemePath/, dir.slice(2, dir.length-1))
    outputFileSync(`${dir}/registration.php`, registrationR)

    let theme = fs.readFileSync('./build/static/theme.xml', 'utf8')
    let themeR = theme.replace(/ThemeName/, themeName)
    outputFileSync(`${dir}/theme.xml`, themeR)

    gulp.src('./build/static/etc/view.xml').pipe(gulp.dest(`${dir}/etc`))
    gulp.src('./build/static/media/preview.jpg').pipe(gulp.dest(`${dir}/media`))

    gulp.src('./build/static/web/**').pipe(gulp.dest(`${dir}/web`))
    gulp.src('./build/static/Magento_Theme/**').pipe(gulp.dest(`${dir}/Magento_Theme`))
  }

  /**
   * 获取当前主题路径
   * @returns {string}
   */
  static themeDir () {
    let currentTheme = this.currentTheme()
    if (currentTheme) {
      let theme = config.themes[currentTheme]
      // return `./frontend/${theme.src}/`
      return path.join(__dirname, `../../frontend/${theme.src}/`)
    } else {
      return ''
    }
  }

  /**
   * 主题输出目录
   * @returns {*}
   */
  static outputDir () {
    let currentTheme = this.currentTheme()
    if (currentTheme) {
      let theme = config.themes[currentTheme]
      return `${path.join(__dirname, '../../../')}app/design/frontend/${theme.src}/`
    } else {
      return ''
    }
  }

  /**
   * 设置需要排除的依赖文件，浅移除加载
   * @returns {Util.excludeShallow|*|Array}
   */
  static excludeShallow () {
    let currentTheme = this.currentTheme()
    return config.themes[currentTheme].excludeShallow ? config.themes[currentTheme].excludeShallow : []
  }

  /**
   * 引入额外的JS库
   */
  static includeJsLib () {
    let currentTheme = this.currentTheme()
    return config.themes[currentTheme].includeJsLib ? config.themes[currentTheme].includeJsLib : []
  }

  /**
   * 指定主题标识
   */
  static currentTheme () {
    return args.theme
  }

  /**
   * 当前主题名
   */
  static currentThemeName () {
    return config.themes[this.currentTheme()].name
  }

  /**
   * 当前模式
   */
  static mode () {
    return args.mode
  }

  /**
   * 合并所有require-config.js配置文件
   */
  static mergeConfig () {
    // let themeDir = path.join(__dirname, `../../${this.themeDir()}`)
    let themeDir = this.themeDir()
    if (this.isDir(themeDir)) {
      let whitelist = /Magento_[\w]+(\/|\\)require-config.js/
      let requireDir = requireDirectory(module, themeDir, {include: whitelist})
      let requireConfigObj = {}
      for (let item of Object.keys(requireDir)) {
        requireConfigObj = _.merge(requireConfigObj, requireDir[item]['require-config'].default)
      }
      let config = String('require.config(' + JSON.stringify(requireConfigObj) + ')')
      outputFileSync(`${themeDir}web${Util.ds()}require-config.js`, config, 'utf-8')
    } else {
      gutil.log(gutil.colors.red(`目录不存在：${themeDir}`))
    }
  }

  /**
   * 是否开启模块压缩
   * @returns {string}
   */
  static isUglify () {
    return args.mode ? 'uglify' : 'none'
  }

  /**
   * 监听的端口
   */
  static port () {
    return args.prot
  }

  /**
   * Cache Clean
   */
  static isCache () {
    return args.cache
  }

  /**
   * 代理URL
   * @returns {*}
   */
  static proxy () {
    if (config.siteConfig.proxy) {
      return config.siteConfig.proxy
    } else {
      gutil.log(gutil.colors.red('请先在配置文件中设置proxy'))
      return false
    }
  }

  /**
   * 获取扩展的模块列表
   * @returns {*}
   */
  static extraModulesList () {
    return config.themes[this.currentTheme()].extraModulesList ? config.themes[this.currentTheme()].extraModulesList : []
  }

  /**
   * 判断主题是否存在
   * @returns {boolean}
   */
  static isThemeDir () {
    if (this.isDir(this.themeDir())) {
      return true
    } else {
      gutil.log(gutil.colors.red(`主题目录不存在：${this.themeDir()}`))
      return false
    }
  }

  /**
   * 传入需要执行的command
   * @param commands
   */
  static shell (commands = []) {
    return shell.task(commands)
  }

  /**
   * 获取magento的bin
   * @returns {*}
   */
  static mageBin () {
    let mageBin = path.join(__dirname, '../../../bin/magento')
    if (this.isDir(mageBin)) {
      return mageBin
    }
    return false
  }

  /**
   * 获取当前系统
   * @returns {*}
   */
  static getOS () {
    return os.platform()
  }

  /**
   * 处理系统路径兼容性
   * @returns {string}
   */
  static ds () {
    return this.getOS() === "win32" ? "\\" : '/'
  }
}

export default Util
