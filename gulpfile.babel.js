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

gulp.task('scripts', () => {
  if (!themeDir) return
  let f = $.filter((file) => {
    return !/(Magento_\w+require-config.js)|lib/.test(file.path)
  }, {restore: true})
  return gulp.src([`${themeDir}/**/*.js`, `!${themeDir}/*/require-config.js`])
    .pipe(f)
    .pipe($.babel())
    .pipe(f.restore)
    .pipe($.rename((path) => {
      let dirname = path.dirname
      path.dirname = dirname.slice(dirname.indexOf('/'))
    }))
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
  outputFileSync(`${outputDir}/web/require-config.js`, `require.config(${JSON.stringify(requireConfigObj)})`)
})
