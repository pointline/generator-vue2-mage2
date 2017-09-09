import gulp from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'
import Util from './build/util/util'
import config from './config'
import requireDirectory from 'require-directory'
import _ from 'lodash'
import outputFileSync from 'output-file-sync'

const $ = gulpLoadPlugins()
const themeDir = Util.currentDir()
const outputDir = Util.outputDir()

gulp.task('default', () => {
})

gulp.task('init', () => {
  Util.initDir(config.themes)
})

gulp.task('babel', () => {
  if (!themeDir) return
  let fLib = $.filter((file) => {
    return !/lib/ig.test(file.path)
  }, {restore: true})
  return gulp.src([`${themeDir}/**/*.js`, `!${themeDir}/*/require-config.js`])
    .pipe(fLib)
    .pipe($.babel())
    .pipe(fLib.restore)
    .pipe(gulp.dest(`${themeDir}/.tmp`))
})

gulp.task('scripts', ['babel'], () => {
  if (!themeDir) return
  let fModules = $.filter((file) => {
    return /modules/ig.test(file.path)
  }, {restore: true})
  return gulp.src(`${themeDir}.tmp/**/*.js`)
    .pipe(fModules)
    .pipe($.requirejsOptimize((file) => {
      return {
        'baseUrl': `${themeDir}.tmp`,
        'optimize': 'none',
        'mainConfigFile': `${themeDir}/web/require-config.js`
      }
    }))
    .pipe($.rename((path) => {
      let dirname = path.dirname
      path.dirname = dirname.slice(dirname.indexOf('/'))
    }))
    .pipe($.debug({title: 'unicorn:'}))
    .pipe(gulp.dest(outputDir))
})

gulp.task('xml', () => {
  if (!themeDir) return
  return gulp.src(`${themeDir}/**/*.xml`)
    .pipe(gulp.dest(outputDir))
})

gulp.task('phtml', () => {
  if (!themeDir) return
  return gulp.src(`${themeDir}/**/*.phtml`)
    .pipe(gulp.dest(outputDir))
})

gulp.task('styles', () => {
  if (!themeDir) return
  return gulp.src(`${themeDir}/**/*.css`)
    .pipe(gulp.dest(outputDir))
})

gulp.task('php', () => {
  if (!themeDir) return
  return gulp.src(`${themeDir}/registration.php`)
    .pipe(gulp.dest(outputDir))
})

gulp.task('images', () => {
  if (!themeDir) return
  return gulp.src(`${themeDir}/**/*.{jpg,jpeg,png,gif,svg}`)
    .pipe(gulp.dest(outputDir))
})

gulp.task('mergeConfig', () => {
  if (!themeDir) return
  let whitelist = /require-config.js/
  let requireDir = requireDirectory(module, themeDir, {include: whitelist})
  let requireConfigObj = {}
  for (let item of Object.keys(requireDir)) {
    requireConfigObj = _.merge(requireConfigObj, requireDir[item]['require-config'].default)
  }
  outputFileSync(`${themeDir}/web/require-config.js`, `require.config(${JSON.stringify(requireConfigObj)})`)
})
