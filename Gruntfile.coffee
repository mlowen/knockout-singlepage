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
		concat:
			dist:
				src: [ 'build/ko-router-core.js' ]
				dest: 'dist/<%= pkg.name %>-debug.js'
		uglify:
			development:
				files:
					'dist/<%= pkg.name %>.js': 'dist/<%= pkg.name %>-debug.js'
		watch:
			compile:
				files: 'src/**/*.coffee'
				tasks: [ 'coffee', 'concat', 'uglify' ]

	grunt.loadNpmTasks 'grunt-contrib-coffee'
	grunt.loadNpmTasks 'grunt-contrib-concat'
	grunt.loadNpmTasks 'grunt-contrib-uglify'
	grunt.loadNpmTasks 'grunt-contrib-watch'

	grunt.registerTask 'default', [ 'coffee', 'concat', 'uglify' ]
