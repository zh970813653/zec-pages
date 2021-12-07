const { src, dest, parallel,series,watch } = require('gulp')
const loadPlugins = require('gulp-load-plugins')
const plugins = loadPlugins()
const del = require('del')
const sass = require('gulp-sass')(require('sass'))
const browserSync = require('browser-sync')
const bs = browserSync.create()
const options = {
  base: 'src'
}
const style = () => {
  return src('src/assets/styles/*.scss', options)
    .pipe(sass())
    .pipe(dest('temp'))
    .pipe(bs.reload({stream:true})) // stream:true 将文件以流的方式传输
}
const clean = ()=> {
  return del(['dist,temp'])
}
const script = () => {
  return src('src/assets/scripts/*.js', options)
    .pipe(plugins.babel({ presets: ['@babel/preset-env'] }))
    .pipe(dest('temp'))
    .pipe(bs.reload({stream:true}))
}
const pages = () => {
  // 同时也可以src/**/*.html  **表示所有的目录下
  return src('src/*.html', options)
    .pipe(plugins.swig())
    .pipe(dest('temp'))
    .pipe(bs.reload({stream:true}))
}
const image = () => {
  return src('src/assets/images/**', options)
    .pipe(plugins.imagemin())
    .pipe(dest('dist'))
}
const public = () => {
  return src('public/**', {base:'public'})
  .pipe(dest('dist'))
}
const font = () => {
  return src('src/assets/fonts/**', options)
    .pipe(plugins.imagemin())
    .pipe(dest('dist'))
}
const dev = ()=> {
  watch(('src/assets/images/**'),style)
  watch(('src/assets/scripts/*.js'),script)
  watch(('src/*.html'),pages)
  watch([
    'src/assets/images/**',
    'public/**',
    'src/assets/fonts/**'
  ],bs.reload)  // bs.reload 重新更新浏览器 浏览器重新发起请求 拿到最新的文件 

  bs.init({
    notify: false, // 删除网页打开右上角提示
    port: 2080, // 设置服务器打开端口
    open: true, // 默认true 自动打开浏览器
    server: {
      baseDir: ['temp','src','public'], 
    }
  })
}
const useref = () => {
  return src('temp/*.html',{base:'temp'})
  .pipe(plugins.useref({searchPath:['temp','.']}))
  .pipe(plugins.if(/.js$/,plugins.uglify())) // 判断读取流是不是以js为结尾，然后调用对应的插件
  .pipe(plugins.if(/.css$/,plugins.cleanCss()))
  .pipe(plugins.if(/.html$/,plugins.htmlmin({
    collapseWhitespace:true, // 是否删除空格
    minifyCSS: true, // 是否将html中style标签中css的压缩
    minifyJS: true, // 是否将html中style标签中js的压缩
  })))
  .pipe(dest('dist'))
}
const compile = parallel(style, script, pages)
const build =series(clean,parallel(series(compile,useref),image,font,public))
// 生成打包执行的任务
// const cleanBuild = series(clean,build)
// 开发环境下执行的任务
const develop = series(compile,dev)
module.exports = {
  compile,
  build,
  cleanBuild,
  develop,
  useref
}