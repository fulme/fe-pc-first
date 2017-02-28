module.exports = function(grunt) {
  require('load-grunt-tasks')(grunt);

  var jsFiles = grunt.file.expand('src/es6/*.js');
  var htmlFiles = grunt.file.expand('src/*.html');
  var buildFolder = 'build/';
  var htmlminFiles = {};
  var htmlInlineOptions = {};
  var uglifyOptions = {};
  var rollupOptions = {};
  var babelFiles = {};

  htmlFiles.forEach(function(file) {
    var filename = file.split('/').pop();
    htmlminFiles[buildFolder + filename] = buildFolder + filename;
    htmlInlineOptions[filename] = {
      options: {
        uglify: true
      },
      src: buildFolder + filename,
      dist: buildFolder + filename
    };
  });

  jsFiles.forEach(function(file) {
    var filename = file.split('/').pop();
    var uglifyFiles = {};
    var rollupFiles = {};

    uglifyFiles[buildFolder + 'js/' + filename] = [buildFolder + 'js/' + filename];
    rollupFiles['src/js/' + filename] = ['src/es6/' + filename];

    uglifyOptions[filename.replace('.js', '')] = {
      options: {
        ASCIIOnly: true,
        compress: {
          unused: true,
          unsafe: true
        }
      },
      files: uglifyFiles
    };

    rollupOptions[filename] = {
      files: rollupFiles,
      options: {
        format: 'iife',
        exports: 'none'
      }
    };

    babelFiles['build/js/' + filename] = 'build/js/' + filename;
  });

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: ['src/css', 'src/js', '*.zip'],

    jshint: {
      all: ['Gruntfile.js', 'es6/**/*.js', 'js/**/*.js']
    },

    csslint: {
      all: ['sass/**/*.css', 'css/**/*.css']
    },

    sass: {
      build: {
        options: {
          noCache: true,
          sourcemap: 'none'
        },
        files: [{
          expand: true,
          cwd: 'src/sass',
          src: '*.scss',
          dest: 'src/css',
          ext: '.css'
        }]
      }
    },

    babel: {
      options: {
        sourceMap: false,
        presets: ['es2015']
      },
      dist: {
        files: babelFiles
      }
    },

    rollup: rollupOptions,

    watch: {
      scripts: {
        files: ['src/es6/*.js', 'src/es6/**/*.js', '../common/es6/**/*.js', 'Gruntfile.js'],
        tasks: ['jshint', 'rollup', 'copy:js']
      },
      styles: {
        files: ['src/sass/**/*.scss'],
        tasks: ['csslint', 'sass', 'copy:css']
      },
      html: {
        files: ['src/*.html'],
        tasks: ['copy:html']
      }
    },

    uglify: uglifyOptions,

    cssmin: {
      build: {
        files: [{
          expand: true,
          cwd: buildFolder + 'css',
          src: '**/*.css',
          dest: buildFolder + 'css'
        }]
      }
    },

    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd: buildFolder,
          src: ['**/*.{png,jpg,gif,ico}'],
          dest: buildFolder
        }]
      }
    },

    htmlmin: {
      build: {
        options: {
          removeComments: true,
          collapseWhitespace: true,
        },
        files: htmlminFiles
      }
    },

    inline: htmlInlineOptions,

    copy: {
      release: {
        expand: true,
        cwd: 'src',
        src: ['./**/*', '!./es6/**', '!./sass/**'],
        dest: 'build'
      },
      css: {
        expand: true,
        cwd: 'src',
        src: ['./css/*.css'],
        dest: buildFolder
      },
      js: {
        expand: true,
        cwd: 'src',
        src: ['./js/**/*.js'],
        dest: buildFolder
      },
      html: {
        expand: true,
        cwd: 'src',
        src: ['./*.html'],
        dest: buildFolder
      }
    }
  });

  grunt.registerTask('default', ['clean', 'rollup', 'sass', 'copy:release', 'watch']);
  grunt.registerTask('es5', function() {
    grunt.task.run([
      'clean',
      'csslint',
      'jshint',
      'rollup',
      'sass',
      'copy:release',
      'babel',
      'inline'
    ]);
  });

  grunt.registerTask('release', function() {
    grunt.task.run([
      'clean',
      'csslint',
      'jshint',
      'rollup',
      'sass',
      'copy:release',
      'babel',
      'uglify',
      'cssmin',
      'imagemin',
      'htmlmin',
      'inline'
    ]);
  });
};
