#!/usr/bin/env groovy
pipeline {
  agent any
  environment {
    NODE_ENV_PATH = './venv'
    NODE_VERSION = '16.17.0'
  }
  stages {
    stage('Pre-cleanup') {
      steps {
        sh 'rm -rf ./venv'
        sh 'rm -rf ./node_modules'
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
