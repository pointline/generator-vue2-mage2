import gulp from 'gulp'
import gulpLoadPlugins from 'gulp-load-plugins'
import Util from './build/util/util'
import browserSync from 'browser-sync'

const $ = gulpLoadPlugins({
  lazy: true,
  pattern: ['gulp-*', 'gulp.*', '@*/gulp{-,.}*', 'cssnano', 'autoprefixer', 'delete', 'less-plugin-est'],
  rename: {
    'less-plugin-est': 'Est'
  }
})
const themeDir = Util.themeDir()
const outputDir = Util.outputDir()
const DS = Util.ds();
const reload = browserSync.reload

gulp.task('default', ['clean'], () => {
  if (!Util.isThemeDir()) return
  gulp.start('build')
})

gulp.task('build', (cb) => {
  $.sequence('fonts', 'php', 'cacheClean', 'phtml', 'images', 'styles', 'mergeConfig', 'scripts')(cb)
})

gulp.task('init', () => {
  Util.initDir()
})

gulp.task('babel', () => {
  let fLib = $.filter((file) => {
    return !/lib/ig.test(file.path)
  }, {restore: true})
  return gulp.src([`${themeDir}**/*.js`, `!${themeDir}*/require-config.js`, `!${themeDir}web/**/*.js`])
    .pipe($.plumber())
    .pipe(fLib)
    .pipe($.babel())
    .pipe($.eslint({
      fix: true,
      envs: [
        'browser'
      ]
    }))
    .pipe($.eslint.format())
    .pipe(fLib.restore)
    .pipe(gulp.dest(`${themeDir}.tmp`))
})

gulp.task('scriptsDep', () => {
  if (Util.excludeShallow().length > 0 || Util.includeJsLib() > 0) {
    let fLibRegExp = new RegExp(`${[...Util.excludeShallow(), ...Util.includeJsLib()].join('|')}`, 'ig')
    let fLib = $.filter((file) => {
      return Boolean(file.path.match(fLibRegExp))
    })
    return gulp.src(`${themeDir}.tmp/**/lib/**/*.js`)
      .pipe($.plumber())
      .pipe(fLib)
      .pipe($.rename((path) => {
        path.dirname = ''
      }))
      .pipe(gulp.dest(`${outputDir}web`))
  }
})

gulp.task('buildScripts', () => {
  return gulp.src(`${themeDir}.tmp/**/modules/*.js`)
    .pipe($.plumber())
    .pipe($.if(!Util.mode(), $.sourcemaps.init()))
    .pipe($.requirejsOptimize((file) => {
      return {
        'baseUrl': `${themeDir}.tmp`,
        'optimize': `${Util.isUglify()}`,
        'mainConfigFile': `${themeDir}web${DS}require-config.js`,
        'excludeShallow': Util.excludeShallow()
      }
    }))
    .pipe($.if(Util.mode(), $.stripDebug()))
    .pipe($.rename((path) => {
      path.dirname = `${DS}modules`
    }))
    .pipe($.if(!Util.mode(), $.sourcemaps.write('.')))
    .pipe(gulp.dest(`${outputDir}web`))
})

gulp.task('scripts', (cb) => {
  $.sequence('babel', 'scriptsDep', 'buildScripts')(cb)
})

gulp.task('xml', () => {
  return gulp.src(`${themeDir}**/*.xml`)
    .pipe(gulp.dest(outputDir))
})

gulp.task('phtml', () => {
  return gulp.src(`${themeDir}**/*.phtml`)
    .pipe($.plumber())
    .pipe($.if(Util.mode(), $.htmlmin({
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
  let est = new $.Est()
  return gulp.src(`${themeDir}web/css/main.less`)
    .pipe($.plumber())
    .pipe($.if(!Util.mode(), $.sourcemaps.init()))
    .pipe($.less({
      plugins: [est]
    }))
    .pipe($.postcss([
      $.autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'ie 9']}),
      $.cssnano()
    ]))
    .pipe($.if(!Util.mode(), $.sourcemaps.write()))
    .pipe(gulp.dest(`${outputDir}web${DS}css${DS}`))
})

gulp.task('php', () => {
  return gulp.src(`${themeDir}registration.php`)
    .pipe(gulp.dest(outputDir))
})

gulp.task('images', () => {
  gulp.src(`${themeDir}media/preview.png`)
    .pipe(gulp.dest(`${outputDir}media`))

  return gulp.src(`${themeDir}web/images/*.{jpg,jpeg,png,gif,svg}`)
    .pipe($.if(Util.mode(), $.cache($.imagemin())))
    .pipe(gulp.dest(outputDir))
})

gulp.task('fonts', () => {
  return gulp.src(`${themeDir}web/fonts/*.{eot,svg,ttf,woff,woff2}`)
    .pipe(gulp.dest(outputDir))
})

gulp.task('mergeConfig', () => {
  return Util.mergeConfig()
})

gulp.task('clean', () => {
  $.delete.sync([`${outputDir}`, `${themeDir}.tmp`, `${themeDir}web${DS}require-config.js`], {force: true})
})

gulp.task('cacheClean', ['xml'], () => {
  if (Util.isCache()) {
    gulp.start('shell')
  }
})

gulp.task('shell', Util.shell([
  `php ${Util.mageBin()} cache:clean`
]))

gulp.task('serve', () => {
  if (!Util.isThemeDir()) return
  if (Util.proxy()) {
    $.sequence('clean', 'build', () => {
      browserSync.init({
        notify: false,
        port: Util.port(),
        proxy: Util.proxy(),
        middleware: Util.setProxyTable(),
        browser: Util.getBrowser()
      })

      gulp.watch(`${themeDir}**/*.scss`, ['styles']).on('change', reload)
      gulp.watch(`${themeDir}**/*.js`, ['scripts']).on('change', reload)
      gulp.watch(`${themeDir}**/*.xml`, ['cacheClean']).on('change', reload)
      gulp.watch(`${themeDir}**/*.phtml`, ['phtml']).on('change', reload)
      gulp.watch(`${themeDir}**/*.php`, ['php']).on('change', reload)
      gulp.watch(`${themeDir}**/*.{jpg,jpeg,png,gif,svg}`, ['images']).on('change', reload)
    })
  }
})
