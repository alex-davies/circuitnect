module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-open');
  grunt.loadNpmTasks('grunt-keepalive');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connect: {
      server: {
        options: {
          port: 55775,
          base: './',
        }
      }
    },
    open: {
      dev: {
        path: 'http://localhost:55775/index.html',
        app: 'Chrome'
      },
      test: {
        path: 'http://localhost:55775/test.html',
        app: 'Chrome'
      }
    }
  });

  grunt.registerTask('default', ['connect', 'open', 'keepalive']);
};