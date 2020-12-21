const path = require('path');
const gulp = require('gulp');
const clean = require('gulp-clean');
const browserSync = require('browser-sync').create();

const reload = browserSync.reload;

// @ clean build
gulp.task('clean', (done) => {
  gulp
      .src(path.join(process.cwd(), 'build/**/*.js'))
      .pipe(clean({force: true}));
  gulp
      .src(path.join(process.cwd(), 'build/**/*.css'))
      .pipe(clean({force: true}));
  gulp
      .src(path.join(process.cwd(), 'build/**/*.html'))
      .pipe(clean({force: true}));

  setTimeout(() => {
    done();
  }, 1000);
});

// @ build
gulp.task('build', gulp.series(['clean']));

// # browser-sync
gulp.task('sync', (done) => {
  browserSync.init({
    server: {
      baseDir: path.join(process.cwd(), 'src'),
    },
  });
  // gulp.watch('./src/**/*.js', gulp.series(['js:web:bundle', 'js:web']));
  gulp.watch('./src/**/*.*').on('change', reload);
  done();
});

// # default task
gulp.task('default', gulp.series(['build']));
