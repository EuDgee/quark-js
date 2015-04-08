

/**
 * Karma configuration
 * Generated on Mon Sep 22 2014 14:21:14 GMT+0400 (MSK)
 * @param {!Object} config
 */
module.exports = function(config) {

  var testFiles = [
    'test/test.js',
    'test/**/*-spec.js',
    'test/**/*-spec.coffee',
    'test/**/*-spec.ts'
  ];

  var FOLDERS = {
    '${sources}': './src',
    '${libs}': './node_modules'
  };

  var LT_GRADLES = [
    '../../lt.gradle',
    './lt.gradle'
  ];

  var LIBS = [];

  var fs = require('fs');

  var lt_gradle = '';
  var files = [];

  function trim(line) {
    return line.trim();
  }

  function isFileLine(line) {
    return line.length > 0 && line[0] === '"';
  }

  function clearQuotesAndCommas(line) {
    return line.replace(/"/g, '').replace(/,/g, '');
  }

  function substituteFolders(line) {
    var mappedLine = line;
    for (var folder in FOLDERS) {
      mappedLine = mappedLine.replace(folder, FOLDERS[folder]);
    }

    return mappedLine;
  }

  for (var j = 0, k = LIBS.length; j < k; j += 1) {
    files.push(LIBS[j]);
  }


  for (var f = 0, s = LT_GRADLES.length; f < s; f += 1) {
    if (fs.existsSync(LT_GRADLES[f])) {
      lt_gradle = LT_GRADLES[f];
    }
  }

  if (lt_gradle) {
    var data = fs.readFileSync(lt_gradle, {'encoding': 'UTF-8'});
    var tmp = data.split('\n').map(trim).filter(isFileLine).
        map(clearQuotesAndCommas).map(substituteFolders);
    for (var x = 0; x < tmp.length; x++) {
      files.push(tmp[x]);
    }
  }

  for (var i = 0, l = testFiles.length; i < l; i += 1) {
    files.push(testFiles[i]);
  }

  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../..',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],

    // list of files / patterns to load in the browser
    files: files,

    // list of files to exclude
    exclude: [
      '**/*.swp'
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors:
    // https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'src/**/*.js': ['coverage'],
      '**/*.coffee': ['coffee'],
      '**/*.ts': ['typescript']
    },

    coffeePreprocessor: {
      options: {
        bare: true,
        sourceMap: false
      },
      transformPath: function(path) {
        return path.replace(/\.coffee$/, '.js');
      }
    },

    typescriptPreprocessor: {
      // options passed to the typescript compiler
      options: {
        sourceMap: false,
        target: 'ES5',
        noImplicitAny: true,
        noResolve: true,
        removeComments: true
      },

      transformPath: function(path) {
        return path.replace(/\.ts$/, '.js');
      }
    },

    // test results reporter to use
    // possible values: 'dots', 'progress', 'spec'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['spec', 'coverage'],

    coverageReporter: {
      type: 'html',
      dir: 'test/coverage/'
    },

    // web server port
    port: 9876,

    hostname: 'karma.dev',

    // enable / disable colors in the output (reporters and logs)
    colors: false,

    // level of logging
    // possible values:
    // config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN ||
    // config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests
    // whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers:
    // https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
