module.exports = function(grunt) {
      grunt.initConfig({
      sass: {
         dist: {
            options: {
	      noCache: true,
              sourcemap: 'none'
	    },
            files: {
             'css/stylesheet.css' : 'sass/stylesheet.scss'
          }
        }
      },
      watch: {
      options: { livereload: true },
      files: ['index.html', 'js/*.js', 'css/*.css'],
      css: {
          files: '**/*.scss',
          tasks: ['sass']
      }
    },
  });
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.registerTask('default',['watch']);
}
