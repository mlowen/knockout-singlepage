var gulp = require('gulp');
var coffee = require('gulp-coffee');

gulp.task('build:source', function() {
	return gulp.src('./src/**/*.coffee')
		.pipe(coffee({ bare: true }))
		.pipe(gulp.dest('./build'));
});

gulp.task('build', [ 'build:source' ]);
gulp.task('default', [ 'build' ]);
