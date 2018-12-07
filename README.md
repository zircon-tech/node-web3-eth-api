# globalshare-blockchain-api

## Install

### Windows 2016 x86

- Clone source code from https://gitlab.com/wolivera/globalshare-blockchain-api
- Install nvm-windows from https://github.com/coreybutler/nvm-windows/releases
- Install Node v10.9 using `nvm install v10.9` if x64 or `nvm install v10.9 32` if x86
- Install Git from https://git-scm.com/download/win
- Install Database
- Replace git url command by running: `git config --global url.https://github.com/.insteadOf git://github.com/`
- Install Windows Build Tools with `npm install --global --production windows-build-tools`
- Install project dependencies with `npm install`
- Make sure the followiing files exist in the root folder (sometimes they are not copied in windows due to its extension): .babelrc, .eslintrc.js, .sequelizerc

- Set the following System Environment Variables properly. All of them start with the prefix "NODE_"

```
  NODE_ENV=production // set to production
  NODE_PORT=5000 // set to desired port where the api will run
  NODE_API_KEY=Z1RcOnT3Ch8lOcKcH4iN4pI // set to desired value (this is expected in the header from clients)
  NODE_DB_CONNECTION_STRING=mssql://user:password@host.com:port/dbname // Follow this format to set db connection

  NODE_ETH_HTTP_PROVIDER=https://ropsten.infura.io/v3/c39fe426d0e145bda0ff89521bbb785b // leave this value
  NODE_ETH_SOCKET_PROVIDER=wss://ropsten.infura.io/ws // leave this value
  NODE_ETH_DOCUMENT_CONTRACT_ADDRESS="0x0F50e3107f96C33aC8556a672e8190F888252dd5" // ethereum contract address
  NODE_ETH_PRIVATE_KEY="a79c6a16a0c0d24d4647d33916136283e635fd28363a8860df950b71709c5781" // ethereum wallet private key
  NODE_ETH_DEFAULT_ACCOUNT_ADDRESS="0x759C3D1931121240F9Ff108eccd2987d070c5Ec6" // ethereum man account address
```