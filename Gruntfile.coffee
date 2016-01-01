module.exports = (grunt) ->
	debugFile = 'dist/<%= pkg.name %>-debug.js'
	banner = '/*!\n * <%= pkg.name %> <%= pkg.version %>\n * (c) <%= pkg.author %> - <%= pkg.homepage %>\n * License: <%= pkg.license.type %> (<%= pkg.license.url %>)\n */\n';

	grunt.initConfig
		pkg: grunt.file.readJSON 'package.json'
		clean: [ 'build', 'tests/*.js' ]
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
			demos:
				options:
					bare: true
				expand: true
				cwd: 'demo'
				dest: 'demo'
				src: [ '**/*.coffee' ]
				ext: '.js'
		jasmine:
			tests:
				src: 'build/**/*.js'
				options:
					specs: 'tests/**/*.js'
					vendor: [ 'bower_components/knockout/dist/knockout.js' ]
		concat:
			options:
				banner: banner
			dist:
				src: [
					'src/fragments/prefix.js'
					'build/url-query-parser.js'
					'build/route.js'
					'build/router.js'
					'build/extension.js'
					'src/fragments/suffix.js'
				]
				dest: debugFile
		uglify:
			dist:
				options:
					banner: banner
				files:
					'dist/<%= pkg.name %>.js': debugFile
		watch:
			compile:
				files: '**/*.coffee'
				tasks: [ 'default' ]
		copy:
			amdDemo:
				files: [ { expand: true, flatten: true, src: debugFile, dest: 'demo/amd/scripts/' } ]
			traditionalDemo:
				files: [ { expand: true, flatten: true, src: debugFile, dest: 'demo/traditional/scripts/' } ]
		compress:
			main:
				options:
					archive: '<%= pkg.name %>-<%= pkg.version %>.zip'
				files: [
					{ src: [ 'README.md', 'LICENSE' ] }
					{
						cwd: 'dist'
						src: [ '*.js' ]
						dest: '<%= pkg.name %>/'
						expand: true
					}
				]

	grunt.loadNpmTasks 'grunt-contrib-coffee'
	grunt.loadNpmTasks 'grunt-contrib-concat'
	grunt.loadNpmTasks 'grunt-contrib-uglify'
	grunt.loadNpmTasks 'grunt-contrib-watch'
	grunt.loadNpmTasks 'grunt-contrib-jasmine'
	grunt.loadNpmTasks 'grunt-contrib-clean'
	grunt.loadNpmTasks 'grunt-contrib-copy'
	grunt.loadNpmTasks 'grunt-contrib-compress'

	grunt.registerTask 'test', [ 'clean', 'coffee', 'jasmine' ]
	grunt.registerTask 'default', [ 'test', 'concat', 'uglify', 'copy' ]
	grunt.registerTask 'package', [ 'default', 'compress' ]
