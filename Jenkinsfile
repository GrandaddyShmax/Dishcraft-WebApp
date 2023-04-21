#!/usr/bin/env groovy
pipeline {
  agent any
  environment {
    NODE_ENV_PATH = './venv'
    NODE_VERSION = '6.11.1'
  }
  stages {
    stage('Pre-cleanup') {
      steps {
        sh 'rm -rf ./venv'
        sh 'rm -rf ./node_modules'
        sh 'rm -rf ./bower_components'
      }
    }
    stage('Make venv') {
      steps {
        sh 'nodeenv --prebuilt -n $NODE_VERSION $NODE_ENV_PATH'
      }
    }
    stage('Install dependencies') {
      steps {
        sh '. ./venv/bin/activate && npm install'
        sh '. ./venv/bin/activate && npm install -g bower'
        sh '. ./venv/bin/activate && bower install'
      }
    }
    stage('Run tests') {
      steps {
        sh '. ./node_env/bin/activate && npm test'
      }
    }
  }
  post {
    failure {
      echo 'Processing failed'
    }
    success {
      echo 'Processing succeeded'
    }
  }
}
