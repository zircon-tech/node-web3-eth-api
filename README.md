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
- Run migrations with `npm run db:migrate`
- Start server with `npm start`

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
- Run migrations with `npm run db:migrate`
- Start server with `npm start`

## Blockchain

You'll find a simple contract called ThingProof which stores in the blockchain a proof of existence for .. a thing. You can extend it to a more specific behaviour as well as extend the object properties. This contract is used to interact with web3 interface and allow frontend users to save their data. It is expected that API consumers send the id and hash of the objects you want to store. You can easily change the controller method so that information is calculated within the API.

In order to get things working, you'll need to deploy your contract and set the contract address and the wallet address in the environment variables.

You can use [remix](https://remix.ethereum.org/) or [mycrypto](https://mycrypto.com/) app to deploy the contract. Bytecode and ABI json are provided in web3 folder.

## Environment variables

Make sure to set the System Environment Variables properly. You can find an example in .env.example file
