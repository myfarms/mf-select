/* eslint-disable */
var gulp = require('gulp'),
  path = require('path'),
  rollup = require('gulp-rollup'),
  rename = require('gulp-rename'),
  fs = require('fs-extra'),
  { execSync } = require('child_process'),
  inlineResources = require('./tools/gulp/inline-resources');

const rootFolder = path.join(__dirname);
const srcFolder = path.join(rootFolder, 'src');
const tmpFolder = path.join(rootFolder, '.tmp');
const buildFolder = path.join(rootFolder, 'build');
const distFolder = path.join(rootFolder, 'dist');
const ngcBin = path.join(rootFolder, 'node_modules', '.bin', 'ngc');
const ngccBin = path.join(rootFolder, 'node_modules', '.bin', 'ngcc');

/**
 * 1. Delete /dist folder
 */
gulp.task('clean:dist', function (done) {
  // Delete contents but not dist folder to avoid broken npm links
  // when dist directory is removed while npm link references it.
  fs.emptyDirSync(distFolder);
  done();
});

/**
 * 2. Clone the /src folder into /.tmp. If an npm link inside /src has been made,
 *    then it's likely that a node_modules folder exists. Ignore this folder
 *    when copying to /.tmp.
 */
gulp.task('copy:source', function () {
  return gulp.src([`${srcFolder}/**/*`, `!${srcFolder}/node_modules`])
    .pipe(gulp.dest(tmpFolder));
});

/**
 * 3. Inline template (.html) and style (.css) files into the the component .ts files.
 *    We do this on the /.tmp folder to avoid editing the original /src files
 */
gulp.task('inline-resources', function () {
  return Promise.resolve()
    .then(() => inlineResources(tmpFolder));
});

/**
 * 4a. Run ngcc to make View Engine libraries (e.g. ngx-virtual-scroller) Ivy-compatible.
 *     This is normally handled automatically by the Angular CLI but must be run explicitly
 *     in a custom build pipeline.
 */
gulp.task('ngcc', function (done) {
  execSync(`"${ngccBin}" --properties es2015 browser module main --first-only --create-ivy-entry-points`, { stdio: 'inherit' });
  done();
});

/**
 * 4b. Run the Angular compiler, ngc, on the /.tmp folder. This will output all
 *    compiled modules to the /build folder.
 */
gulp.task('ngc', function (done) {
  execSync(`"${ngcBin}" --project "${tmpFolder}/tsconfig.es5.json"`, { stdio: 'inherit' });
  done();
});

/**
 * 5. Run rollup inside the /build folder to generate our Flat ES module and place the
 *    generated file into the /dist folder
 */
gulp.task('rollup:fesm', function () {
  return gulp.src(`${buildFolder}/**/*.js`)
    .pipe(rollup({
      input: `${buildFolder}/index.js`,
      allowRealFiles: true,
      external: [
        '@angular/core',
        '@angular/common',
        '@angular/forms',
        'ngx-virtual-scroller',
      ],
      output: {
        format: 'es'
      }
    }))
    .pipe(gulp.dest(distFolder));
});

/**
 * 6. Run rollup inside the /build folder to generate our UMD module and place the
 *    generated file into the /dist folder
 */
gulp.task('rollup:umd', function () {
  return gulp.src(`${buildFolder}/**/*.js`)
    .pipe(rollup({
      input: `${buildFolder}/index.js`,
      allowRealFiles: true,
      external: [
        '@angular/core',
        '@angular/common',
        '@angular/forms',
        'ngx-virtual-scroller',
      ],
      output: {
        format: 'umd',
        exports: 'named',
        name: 'mf-select',
        globals: {
          typescript: 'ts'
        }
      }
    }))
    .on('error', function (error) {
      console.error(error.toString());
    })
    .pipe(rename('mf-select.umd.js'))
    .pipe(gulp.dest(distFolder));
});

/**
 * 7. Copy all the files from /build to /dist, except .js files. We ignore all .js from /build
 *    because we don't need individual modules anymore, just the Flat ES module generated
 *    on step 5.
 */
gulp.task('copy:build', function () {
  return gulp.src([`${buildFolder}/**/*`, `!${buildFolder}/**/*.js`])
    .pipe(gulp.dest(distFolder));
});

/**
 * 8. Copy package.json from /src to /dist
 */
gulp.task('copy:manifest', function () {
  return gulp.src([`${srcFolder}/package.json`])
    .pipe(gulp.dest(distFolder));
});

/**
 * 9. Copy README.md from / to /dist
 */
gulp.task('copy:readme', function () {
  return gulp.src([path.join(rootFolder, 'README.md')])
    .pipe(gulp.dest(distFolder));
});

/**
 * 10. Delete /.tmp folder
 */
gulp.task('clean:tmp', function (done) {
  deleteFolder(tmpFolder);
  done();
});

/**
 * 11. Delete /build folder
 */
gulp.task('clean:build', function (done) {
  deleteFolder(buildFolder);
  done();
});

gulp.task('compile', gulp.series(
  'clean:dist',
  'copy:source',
  'inline-resources',
  'ngcc',
  'ngc',
  'rollup:umd',
  'copy:build',
  'copy:manifest',
  'clean:build',
  'clean:tmp'
));

gulp.task('compile:dist', gulp.series(
  'clean:dist',
  'copy:source',
  'inline-resources',
  'ngcc',
  'ngc',
  'rollup:fesm',
  'rollup:umd',
  'copy:build',
  'copy:manifest',
  'copy:readme',
  'clean:build',
  'clean:tmp'
));

/**
 * Watch for any change in the /src folder and compile files
 */
gulp.task('watch', function () {
  return gulp.watch(`${srcFolder}/**/*`, gulp.series('compile'));
});

gulp.task('clean', gulp.parallel('clean:dist', 'clean:tmp', 'clean:build'));

gulp.task('build', gulp.series('clean', 'compile:dist'));
gulp.task('build:watch', gulp.series('clean', 'compile', 'watch'));
gulp.task('default', gulp.series('build:watch'));

/**
 * Deletes the specified folder
 */
function deleteFolder(folder) {
  return fs.removeSync(folder);
}
