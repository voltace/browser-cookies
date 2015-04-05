// Karma configuration
module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: ['index.js', 'test.js'],
    reporters: ['progress', 'spec', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_WARN,
    autoWatch: true,
    browsers: ['PhantomJS'],
    singleRun: true,
    preprocessors: {
      'index.js': ['wrap', 'coverage'],
    },
    wrapPreprocessor: {
      template: 'function requireTinyCookies(document, Date, exports) { <%= contents %> }'
    },
    coverageReporter: {
      dir: 'coverage/',
      reporters: [
        {type: 'lcov', subdir: '.' },
        {type: 'cobertura', subdir: '.', file: 'cobertura.xml'}
      ]
    }
  });
};
