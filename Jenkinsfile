#!/usr/bin/env groovy
pipeline {
  agent any
  environment {
    NODE_ENV_PATH = './venv'
    NODE_VERSION = '16.17.0'
    
    DB_URL=credentials('db_url')
    
    APP_ID=credentials('app_id')
    APP_KEYS=credentials('app_keys')

    APP_ID2=credentials('app_id2')
    APP_KEYS2=credentials('app_keys2')

    USERMAIL=credentials('usermail')
    USERPASS=credentials('userpass')

    OPENAI_API_KEY=credentials('openai_api_key')
  }
  stages {
    stage('Pre-cleanup') {
      steps {
        sh 'rm -rf ./node_modules'
      }
    }
    stage('Install dependencies') {
      steps {
        sh 'npm install'
      }
    }
    stage('Run tests') {
      steps {
        sh 'npm test'
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
