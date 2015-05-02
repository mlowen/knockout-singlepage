module.exports = (grunt) ->
	grunt.initConfig
		pkg: grunt.file.readJSON 'package.json'
		coffee:
			compile:
				options:
					bare: true
				expand: true
				cwd: 'src'
				dest: 'build'
				src: [ '**/*.coffee' ]
				ext: '.js'
			tests:
				options:
					bare: true
				expand: true
				cwd: 'tests'
				dest: 'tests'
				src: [ '**/*.coffee' ]
				ext: '.js'
		jasmine:
			tests:
				src: 'build/**/*.js'
				options:
					specs: 'tests/**/*.js'
					vendor: [
						'bower_components/knockout/dist/knockout.js'
					]
		concat:
			dist:
				src: [
					'src/fragments/prefix.js'
					'build/ko-singlepage-router.js'
					'build/ko-singlepage-extension.js'
					'src/fragments/suffix.js'
				]
				dest: 'dist/<%= pkg.name %>-debug.js'
		uglify:
			dist:
				files:
					'dist/<%= pkg.name %>.js': 'dist/<%= pkg.name %>-debug.js'
		watch:
			compile:
				files: '**/*.coffee'
				tasks: [ 'default' ]

	grunt.loadNpmTasks 'grunt-contrib-coffee'
	grunt.loadNpmTasks 'grunt-contrib-concat'
	grunt.loadNpmTasks 'grunt-contrib-uglify'
	grunt.loadNpmTasks 'grunt-contrib-watch'
	grunt.loadNpmTasks 'grunt-contrib-jasmine'

	grunt.registerTask 'default', [ 'coffee', 'jasmine', 'concat', 'uglify' ]
	grunt.registerTask 'test', [ 'coffee', 'jasmine' ]
