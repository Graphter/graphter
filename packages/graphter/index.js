#!/usr/bin/env node

const execSync = require('child_process').execSync;

execSync('npx create-react-app --template cra-template-graphter-typescript ' + process.argv.slice(2).join(' '))