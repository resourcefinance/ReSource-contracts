# Smart Contracts for the ReSource Network
## A mutual credit blockchain protocol

Initial version is deployed in CELO mainnet on address: 0x39049c02a56c3ecd046f6c2a9be0cffa2bc29c08

## Local Development

1. Install Celo's Ganache:

- $ npm install -g @celo/ganache-cli

2. Run Ganache

- $ ganache-cli --port 8545 --networkId 1101

3. Setup celo monorepo project


- Folow this guide: https://github.com/celo-org/celo-monorepo/blob/master/SETUP.md to install deps instead of the celo docs

- You can likely ignore the Android section

- This specific pinned node version & env vars is recommended if you run into any problems:

$ nvm install 10.24.0
$ nvm use 10.24.0
$ nvm alias default 10.24.0
$ export NODE_PATH=$NODE_PATH:`npm root -g`
$ export NO_SYNCCHECK=true

4. Go to monorepo packages/protocols/scripts

The contents of teh ganach.sh script can be run via:

$ yarn run ganache-dev

However, run it with more accounts and a higher gas limit and default balance - ie:

$ yarn run ganache-cli \
  --deterministic \
  --mnemonic 'concert load couple harbor equip island argue ramp clarify fence smart topic' \
  --gasPrice 0 \
  --networkId 1101 \
  --gasLimit 200000000 \
  --defaultBalanceEther 2000000000 \
  --allowUnlimitedContractSize \
  -a 100


5. Go to monorepo packages/protocol/scripts

$ yarn run init-network -n development

6. Go to resource contracts and install

$ npm install

7. Migrate

$ npm migrate

or

$ truffle migrate --network test


6. Use celo cli tool to interact

- Must install celocli

- Run

$ celocli config:get

- Should get

node: http://localhost:8545
gasCurrency: auto
