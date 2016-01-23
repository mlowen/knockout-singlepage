var gulp = require('gulp');
var coffee = require('gulp-coffee');
var jasmine = require('gulp-jasmine-phantom');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

var jsFiles = [
	'./build/url-query-parser.js',
	'./build/route.js',
	'./build/router.js',
	'./build/extension.js'
]

gulp.task('build:source', function () {
	return gulp.src('./src/**/*.coffee')
		.pipe(coffee({ bare: true }))
		.pipe(gulp.dest('./build'));
});

gulp.task('build:tests', function () {
	return gulp.src('./tests/**/*.coffee')
		.pipe(coffee({ bare: true }))
		.pipe(gulp.dest('./tests'));
});

gulp.task('build:demos', function () {
	return gulp.src('./demo/**/*.coffee')
		.pipe(coffee({ bare: true }))
		.pipe(gulp.dest('./demo'))
});

gulp.task('build:release', [ 'run:tests' ], function () {
	return gulp.src([
			'src/fragments/prefix.js',
			'build/url-query-parser.js',
			'build/route.js',
			'build/router.js',
			'build/extension.js',
			'src/fragments/suffix.js',
		])
		.pipe(concat('knockout-singlepage.js'))
		.pipe(uglify())
		.pipe(gulp.dest('./dist'));
});

gulp.task('run:tests', [ 'build' ], function () {
	return gulp.src('./tests/**/*.js')
		.pipe(jasmine({
			jasmineVersion: "2.3",
			integration: true,
			vendor: [
				'./node_modules/knockout/build/output/knockout-latest.debug.js',
				'./build/**/*.js'
			]
		}));
});

gulp.task('build', [ 'build:source', 'build:tests', 'build:demos' ]);
gulp.task('default', [ 'build' ]);
