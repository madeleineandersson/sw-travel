const gulp = require("gulp"),
  babel = require("gulp-babel"),
  uglify = require("gulp-uglify"),
  sass = require("gulp-sass"),
  postcss = require("gulp-postcss"),
  autoprefixer = require("autoprefixer"),
  cssnano = require("cssnano"),
  htmlmin = require("gulp-htmlmin");

const paths = {
  styles: {
    input: "src/scss/*.scss"
  }
};

gulp.task("scripts", () => {
  return gulp
    .src(["src/js/*.js"])
    .pipe(babel({ presets: ["es2015"] }))
    .pipe(uglify())
    .pipe(gulp.dest("dist/js"));
});

gulp.task("styles", () => {
  return gulp
    .src(paths.styles.input)
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer(), cssnano()]))
    .pipe(gulp.dest("dist/css"));
});

gulp.task("watch", () => {
  gulp.watch(paths.styles.input, function watchStyles() {
    return gulp
      .src(paths.styles.input)
      .pipe(sass().on("error", sass.logError))
      .pipe(gulp.dest("src/css"));
  });
});

gulp.task("pages", () => {
  return gulp
    .src(["./src/**/*.html"])
    .pipe(
      htmlmin({
        collapseWhitespace: true
      })
    )
    .pipe(gulp.dest("dist"));
});

gulp.task("images", () => {
  return gulp.src("src/img/*.png").pipe(gulp.dest("dist/img"));
});

gulp.task("build", done => {
  const runTasks = gulp.series("scripts", "styles", "pages", "images");
  runTasks();
  done();
});
