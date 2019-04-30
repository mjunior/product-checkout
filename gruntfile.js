// Load Grunt
module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      main: {
        files:[
          {
            expand: true,
            cwd: 'node_modules/jquery/dist',
            src: 'jquery.min.js',
            dest: 'public/js'
          },
          {
            expand: true,
            cwd: 'node_modules/sweetalert2/dist',
            src: 'sweetalert2.all.min.js',
            dest: 'public/js'
          },
          {
            expand: true,
            cwd: 'node_modules/sweetalert2/dist',
            src: 'sweetalert2.min.css',
            dest: 'public/css'
          }
        ]
      },
    },
    babel: {
      options: {
        sourceMap: false,
        presets: ['@babel/preset-env']
      },
      dist: {
        files: {
          'public/js/script.js':'src/js/script.js'
        }
      }
    },
    sass: {
      // Begin Sass Plugin
      dist: {
        files: [
          {
            expand: true,
            cwd: 'src/sass',
            src: ['**/*.scss'],
            dest: 'public/css',
            ext: '.css',
          },
        ],
      },
    },
    postcss: {
      // Begin Post CSS Plugin
      options: {
        map: false,
        processors: [
          require('autoprefixer')({
            browsers: ['last 2 versions'],
          }),
        ],
      },
      dist: {
        src: 'public/css/style.css',
      },
    },
    cssmin: {
      // Begin CSS Minify Plugin
      target: {
        files: [
          {
            expand: true,
            sourceMap: false,
            cwd: 'public/css/',
            src: ['*.css', '!*.min.css'],
            dest: 'public/css',
            ext: '.min.css',
          },
        ],
      },
    },
    uglify: {
      // Begin JS Uglify Plugin
      build: {
        src: ['public/js/script.js'],
        dest: 'public/js/script.min.js',
      },
    },
    
    watch: {
      // Compile everything into one task with Watch Plugin
      css: {
        files: 'src/**/*.scss',
        tasks: ['sass', 'postcss', 'cssmin'],
      },
      js: {
        files: 'src/**/*.js',
        tasks: ['babel','uglify'],
      },
    },
  })
  // Load Grunt plugins
  grunt.loadNpmTasks('grunt-contrib-sass')
  grunt.loadNpmTasks('grunt-postcss')
  grunt.loadNpmTasks('grunt-contrib-cssmin')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-babel');
  
  // Register Grunt tasks
  grunt.registerTask('default', ['copy', 'watch'])
}
