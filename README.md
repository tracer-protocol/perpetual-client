## Status
This client is still in development. We have recently begun implementing a forked version of web3-redux to make cross chain integration easier in the future.

## Stable Branches 
- [ ] master
- [ ] develop


## Todos
- Development of storybook stories for each of the components
- More detailed components for the advanced trading interface
- Continued integration of web3-redux
- Originally implemented tailwind css, as the dapp grew I began to like it less and less, I wouldnt be opposed to moving away from this in place of styled components or another inline css. Reasoning being longer term, I dont see tailwind flopping, its more of a matter of inter-compatibility.


## Setup
In order to get the full Dapp running you will need to have a local deployed instance of the tracer contracts, the graph, the executioner and the OME.
You can get most of the functionality without the executioner and the OME, however you wont be able to create offchain orders.

## Storybook Development
To make it easier to onboard and develop components and view components in isolation run 
```
  npm run storybook || yarn storybook
```

## Contracts
Although you can run them in isolation using node package links, we have a (tracer-workspace)[https://github.com/lions-mane/tracer-workspace] repositiory designed to make this easier using leara. Lerna handles building and compiling the contracts. You will still have to run a local chain and run yarn migrate from within the 
(tracer-protocol)[https://github.com/tracer-protocol/tracer-protocol] repository.

### Contract Addresses
To make development easier, all contract addresses come from ENV vars. The web3-redux store will create instances of those contracts automatically. 

Create a .env.local in your root directory and set the contract addresses
```
  NEXT_PUBLIC_FACTORY_ADDRESS="address from truffle migrate"
  NEXT_PUBLIC_INSURANCE_ADDRESS="address from truffle migrate"
  NEXT_PUBLIC_ACCOUNT_ADDRESS="address from truffle migrate"
  NEXT_PUBLIC_PRICING_ADDRESS="address from truffle migrate"
  NEXT_PUBLIC_ORACLE_ADDRESS="address from truffle migrate"
  NEXT_PUBLIC_TRADER_ADDRESS="address from truffle migrate"
  NEXT_PUBLIC_GRAPH_URI=http://localhost:8000/subgraphs/name/dospore/tracer-graph // or whatever your deployed subgraph is
  NEXT_PUBLIC_LOCAL_RPC=ws://localhost:8545 // This is key since web3-redux detects this variable and adds a network with id 1337
```


## Subgraph
Checkout (tracer-graphs)[https://github.com/lions-mane/tracer-graphs] to deploy the respective tracer-subgraphs.


## Running
Install packages with
```
  npm install || yarn
```

Run the development server:

```bash
  npm run dev || yarn dev
```
