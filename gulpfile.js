var gulp = require("gulp");
(browserSync = require("browser-sync")),
  (less = require("gulp-less")),
  (cssnano = require("gulp-cssnano")),
  (autoprefixer = require("gulp-autoprefixer")),
  (concat = require("gulp-concat")),
  (uglify = require("gulp-uglify")),
  (imagemin = require("gulp-imagemin")),
  (rename = require("gulp-rename"));

gulp.task("browser-sync", function() {
  browserSync({
    server: {
      baseDir: "./",
      index: 'about-us.html'
    },
    notify: false
  });
});

gulp.task("html", function() {
  return gulp.src("*.html").pipe(browserSync.reload({ stream: true }));
});

gulp.task("compress", () =>
  gulp
    .src("src/images/**/*.+(png|jpg|jpeg|gif|svg)")
    .pipe(imagemin())
    .pipe(gulp.dest("build/images"))
);

gulp.task("less", function() {
  return gulp
    .src("./src/less/**/*.less")
    .pipe(concat("styles.less"))
    .pipe(less())
    .pipe(
      autoprefixer({
        browsers: ["last 2 versions"],
        cascade: false
      })
    )
    .pipe(cssnano())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("build/css"))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task("scripts", function() {
  return gulp
    .src("src/js/*.js")
    .pipe(concat("scripts.js"))
    .pipe(uglify())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("build/js"))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task("watch", function() {
  gulp.watch("src/js/*.js", gulp.parallel("scripts"));
  gulp.watch("src/less/**/*.less", gulp.parallel("less"));
  gulp.watch("*html", gulp.parallel("html"));
  gulp.watch("images/*", gulp.parallel("compress"));
});

gulp.task(
  "default",
  gulp.parallel("less", "scripts", "browser-sync", "compress", "watch")
);
