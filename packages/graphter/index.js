#!/usr/bin/env node

const execSync = require('child_process').execSync;
const figlet = require('figlet')

console.log(figlet.textSync('Graphter', {
  font: 'Electronic'
}))
console.log('Generating your new project...')
execSync('npx create-react-app --template cra-template-graphter-typescript ' + process.argv.slice(2).join(' '), { stdio: 'inherit' })