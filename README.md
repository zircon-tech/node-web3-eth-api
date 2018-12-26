# Node - Web3 - Ethereum - API

This source code works as a boilerplate (or simply as an example) to build an NodeJS API on top of an Ethereum contract by using Web3.


## Features

- Solidity contract to keep a proof of existence for anything
- Truffle/Ganache configuration for Contracts development
- Node JS API with services to create and fetch tracked objects
- Web3 layer to communicate with the contract
- Database layer through Sequelize to persist objects saved on the blockchain to easily access data
- Watcher methods to keep track of transactions status


## Install

### Linux - OSX

- Clone source code
- Install Node v10+
- Install mysql
- Install project dependencies with `npm install`

### Windows 2016 x86

- Clone source code
- Install nvm-windows from https://github.com/coreybutler/nvm-windows/releases
- Install Node v10.9 using `nvm install v10.9` if x64 or `nvm install v10.9 32` if x86
- Install Git from https://git-scm.com/download/win
- Install Database
- Replace git url command by running: `git config --global url.https://github.com/.insteadOf git://github.com/`
- Install Windows Build Tools with `npm install --global --production windows-build-tools`
- Install project dependencies with `npm install`
- Make sure the followiing files exist in the root folder (sometimes they are not copied in windows due to its extension): .babelrc, .eslintrc.js, .sequelizerc


## Environment variables

Make sure to set the System Environment Variables properly. You can find an example in .env.example file
