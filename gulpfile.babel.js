import gulp from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'
import Util from './build/util/util'
import requireDirectory from 'require-directory'
import _ from 'lodash'
import outputFileSync from 'output-file-sync'
import runSequence from 'run-sequence'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'
import browserSync from 'browser-sync'
import del from 'del'

const $ = gulpLoadPlugins({lazy: true})
const themeDir = Util.themeDir()
const outputDir = Util.outputDir()
const sequence = runSequence.use(gulp)
const reload = browserSync.reload

gulp.task('default', () => {

})

gulp.task('build', () => {
  sequence('mergeConfig', ['xml', 'phtml', 'styles', 'fonts', 'php', 'images'], 'scripts')
})

gulp.task('init', () => {
  Util.initDir()
})

gulp.task('babel', () => {
  if (!themeDir) return
  let fLib = $.filter((file) => {
    return !/lib/ig.test(file.path)
  }, {restore: true})
  return gulp.src([`${themeDir}**/*.js`, `!${themeDir}*/require-config.js`])
    .pipe($.plumber())
    .pipe(fLib)
    .pipe($.babel())
    .pipe($.eslint({ fix: true }))
    .pipe($.eslint.format())
    .pipe(fLib.restore)
    .pipe(gulp.dest(`${themeDir}.tmp`))
})

gulp.task('scriptsDep', () => {
  if (!themeDir) return
  if (Util.excludeShallow().length > 0) {
    let fLibRegExp = new RegExp(`${Util.excludeShallow()}`, 'ig')
    let fLib = $.filter((file) => {
      return fLibRegExp.test(file.path)
    })
    return gulp.src(`${themeDir}.tmp/**/lib/*.js`)
      .pipe($.plumber())
      .pipe(fLib)
      .pipe($.rename((path) => {
        let dirname = path.dirname
        path.dirname = dirname.slice(dirname.indexOf('/'))
      }))
      .pipe(gulp.dest(outputDir))
  }
})

gulp.task('buildScripts', () => {
  if (!themeDir) return
  return gulp.src(`${themeDir}.tmp/**/modules/*.js`)
    .pipe($.plumber())
    .pipe($.if(!Util.mode(), $.sourcemaps.init()))
    .pipe($.requirejsOptimize((file) => {
      return {
        'baseUrl': `${themeDir}.tmp`,
        'optimize': 'none',
        'mainConfigFile': `${themeDir}web/require-config.js`,
        'excludeShallow': Util.excludeShallow()
      }
    }))
    .pipe($.rename((path) => {
      let dirname = path.dirname
      path.dirname = dirname.slice(dirname.indexOf('/'))
    }))
    .pipe($.if(!Util.mode(), $.sourcemaps.write('.')))
    .pipe(gulp.dest(outputDir))
})

gulp.task('scripts', () => {
  sequence('babel', 'scriptsDep', 'buildScripts')
})

gulp.task('xml', () => {
  if (!themeDir) return
  return gulp.src(`${themeDir}**/*.xml`)
    .pipe(gulp.dest(outputDir))
})

gulp.task('phtml', () => {
  if (!themeDir) return
  return gulp.src(`${themeDir}**/*.phtml`)
    .pipe($.plumber())
    .pipe($.if(!Util.mode(), $.htmlmin({
      collapseWhitespace: true,
      minifyCSS: true,
      minifyJS: {compress: {drop_console: true}},
      processConditionalComments: true,
      removeComments: true,
      removeEmptyAttributes: true,
      removeScriptTypeAttributes: true,
      removeStyleLinkTypeAttributes: true
    })))
    .pipe(gulp.dest(outputDir))
})

gulp.task('styles', () => {
  if (!themeDir) return
  return gulp.src(`${themeDir}web/css/main.scss`)
    .pipe($.plumber())
    .pipe($.if(!Util.mode(), $.sourcemaps.init()))
    .pipe($.sass.sync({
      outputStyle: 'expanded',
      precision: 10,
      includePaths: ['.']
    }).on('error', $.sass.logError))
    .pipe($.postcss([
      autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}),
      cssnano()
    ]))
    .pipe($.if(!Util.mode(), $.sourcemaps.write()))
    .pipe(gulp.dest(`${outputDir}web/css/`))
})

gulp.task('php', () => {
  if (!themeDir) return
  return gulp.src(`${themeDir}registration.php`)
    .pipe(gulp.dest(outputDir))
})

gulp.task('images', () => {
  if (!themeDir) return
  return gulp.src(`${themeDir}**/*.{jpg,jpeg,png,gif,svg}`)
    .pipe($.cache($.imagemin()))
    .pipe(gulp.dest(outputDir))
})

gulp.task('fonts', () => {
  return gulp.src(`${themeDir}**/*.{eot,svg,ttf,woff,woff2}`)
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
  outputFileSync(`${themeDir}web/require-config.js`, `require.config(${JSON.stringify(requireConfigObj)})`)
})

gulp.task('clean', () => {
  del([`${outputDir}`, `${themeDir}.tmp`, `${themeDir}web/require-config.js`], {force: true})
})

gulp.task('serve', ['build'], () => {
  browserSync.init({
    notify: false,
    port: 9000,
    ui: false,
    proxy: 'http://magentotest.local'
  })

  gulp.watch(`${themeDir}**/*.scss`, ['styles']).on('change', reload)
  gulp.watch(`${themeDir}**/*.js`, ['scripts']).on('change', reload)
  gulp.watch(`${themeDir}**/*.xml`, ['xml']).on('change', reload)
  gulp.watch(`${themeDir}**/*.phtml`, ['phtml']).on('change', reload)
  gulp.watch(`${themeDir}**/*.php`, ['php']).on('change', reload)
  gulp.watch(`${themeDir}**/*.{jpg,jpeg,png,gif,svg}`, ['images']).on('change', reload)
})
