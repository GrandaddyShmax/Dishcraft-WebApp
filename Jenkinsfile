#!/usr/bin/env groovy
pipeline {
  agent {
    docker {
      image 'node:bullseye-slim' 
      args '-p 8080:3000' 
    }
  }
  environment {
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
    stage('Run unit tests & & Check coverage') {
      steps {
        sh 'npm run coverage'
      }
    }
    stage('Check for code duplicates') {
      steps {
        sh 'npm run cpd'
      }
    }
    stage('Check for complience with coding rules') {
      steps {
        sh 'npm run grunt'
      }
    }
    stage('Check deployment time') {
      steps {
        sh 'npm run dtime'
      }
    }
    stage('Run integration tests') {
      steps {
        sh 'npm run integration'
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
