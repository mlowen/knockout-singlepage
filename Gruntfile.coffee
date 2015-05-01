module.exports = (grunt) ->
	grunt.initConfig
		pkg: grunt.file.readJSON 'package.json'
		coffee:
			options:
				sourceMap: true
				bare: true
			expand: true
			cwd: 'src'
			dest: 'dist'
			src: [ '**/*.coffee' ]
			ext: '.js'

	grunt.loadNpmTasks 'grunt-contrib-coffee'

	grunt.registerTask 'default', [ 'coffee' ]
