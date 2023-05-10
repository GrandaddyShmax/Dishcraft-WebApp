module.exports = function (grunt) {
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.initConfig({
    jshint: {
    all: ["Gruntfile.js", "*.js", "**/*.js"],
      options: {
        esversion: 11,
        ignores: ['node_modules/**/*.js']
      },
    },
  });
};
