// Karma configuration file
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      jasmine: {
        // Specs without at least one expect() will fail automatically
        failSpecWithNoExpectations: true
      },
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true // removes duplicated stack traces
    },
    coverageReporter: {
      dir: require('path').join(__dirname, './coverage/pomode-app'),
      subdir: '.',
      reporters: [
        { type: 'html' },
        { type: 'text-summary' }
      ],
      check: {
        global: {
          statements: 60,
          branches: 50,
          functions: 60,
          lines: 60
        }
      }
    },
    reporters: ['progress', 'kjhtml'],
    browsers: ['Chrome'],
    restartOnFileChange: true
  });
};
