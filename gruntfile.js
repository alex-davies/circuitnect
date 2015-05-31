module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-typescript');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-open');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connect: {
      server: {
        options: {
          port: 55775,
          base: './'
        }
      }
    },
    typescript: {
      base: {
        src: ['index.ts'],
        dest: 'index.js',
        options: {
          module: 'amd',
          target: 'es5'
        }
      },
      test: {
        src: ['test.ts'],
        dest: 'test.js',
        options: {
          module: 'amd',
          target: 'es5'
        }
      }
    },
    watch: {
      files: ['**/*.ts','**/*.html'],
      tasks: ['connect']
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

  grunt.registerTask('default', ['connect', 'open', 'watch']);
  grunt.registerTask('test', ['connect', 'open:test', 'watch']);
};