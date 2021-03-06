import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import path from 'path';
import del from 'del';
import runSequence from 'run-sequence';
import pm2 from 'pm2';

const plugins = gulpLoadPlugins();

const paths = {
  js: ['./**/*.js', '!dist/**', '!node_modules/**', '!coverage/**'],
  nonJs: ['./package.json', './.gitignore', './.env'],
  tests: './server/tests/*.js',
  web3: ['./src/services/web3/**/*.json'],
};

// Clean up dist and coverage directory
gulp.task('clean', () => del.sync(['dist/**', 'dist/.*', 'coverage/**', '!dist', '!coverage']));

// Copy non-js files to dist
gulp.task('copy-nonjs', () =>
  gulp
    .src(paths.nonJs)
    .pipe(plugins.newer('dist'))
    .pipe(gulp.dest('dist'))
);

gulp.task('copy-web3', () => gulp.src(paths.web3).pipe(gulp.dest('dist/src/services/web3/')));

gulp.task('copy', ['copy-nonjs', 'copy-web3']);

// Compile ES6 to ES5 and copy to dist
gulp.task('babel', () =>
  gulp
    .src([...paths.js, '!gulpfile.babel.js'], { base: '.' })
    .pipe(plugins.newer('dist'))
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.babel())
    .pipe(
      plugins.sourcemaps.write('.', {
        includeContent: false,
        sourceRoot(file) {
          return path.relative(file.path, __dirname);
        },
      })
    )
    .pipe(gulp.dest('dist'))
);

// Start server with restart on file changes
gulp.task('nodemon', ['copy', 'babel'], () =>
  plugins.nodemon({
    script: path.join('dist', 'index.js'),
    ext: 'js',
    ignore: ['node_modules/**/*.js', 'dist/**/*.js'],
    tasks: ['copy', 'babel'],
  })
);

gulp.task('pm2', ['copy', 'babel'], () => {
  pm2.connect(
    true,
    () => {
      pm2.start(
        {
          name: 'server',
          script: path.join('dist', 'index.js'),
        },
        () => {
          pm2.streamLogs('all', 0);
        }
      );
    }
  );
});

// gulp serve for development
gulp.task('serve', ['clean'], () => {
  if (process.env.NODE_ENV === 'production') {
    return runSequence('pm2');
  }
  return runSequence('nodemon');
});

// default task: clean dist, compile js files and copy non-js files.
gulp.task('default', ['clean'], () => {
  runSequence(['copy', 'babel']);
});
