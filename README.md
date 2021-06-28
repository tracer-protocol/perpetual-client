## Status

  
This client is still in development. It serves as an interface to the tracer-protocol contracts, allowing users to long/short assets view their positions and provide insurance to the protocol to earn yield.

## Stable Branches

- master

- develop

  

## Todos


- Remove most of tailwind css, as the dapp grew I began to like it less and less, I wouldnt be opposed to moving away from this in place of styled components or another inline css. Reasoning being longer term, I dont see tailwind flopping, its more of a matter of inter-compatibility.
- Build starter script to make it easier to get started
- Remove old story book stuff
- setup testing

## Setup

 
In order to get the full Dapp running locally you will need to run a number of things. If you want to get started straight away, you should be able to start the app and switch to kovan. Kovan will have a running instance of everything you need. The only thing to note is that the OME_BASE_URL does not change between networks so that will need to be updated in the .env  file if you wish to view the orderbook.

A complete list of the required tooling is as follows

- a local running instance of [the graph](https://thegraph.com/) with the deployed [subgraph](https://github.com/lions-mane/tracer-graphs).
- the [executioner](https://github.com/tracer-protocol/executioner)
- the [tracer-ome](https://github.com/tracer-protocol/tracer-ome)
- a development rpc such as [ganache-cli](https://github.com/trufflesuite/ganache-cli)
- deployed [tracer-contracts](https://github.com/tracer-protocol/tracer-protocol) to the above network

### Testnet Details
- [Subgraph](https://thegraph.com/explorer/subgraph/tracer-protocol/tracer-kovan)
- [OME](https://order.tracer.finance)


### Environment Variables 

Create a .env.local in your root directory and set the following variables

```
NEXT_PUBLIC_TRADER_ADDRESS="address from truffle migrate"
NEXT_PUBLIC_GRAPH_URI=http://localhost:8000/subgraphs/name/{your-local-name}/{your-deployed-graph-name}
NEXT_PUBLIC_OME_BASE_URL=http://localhost:8989 || https://order.tracer.finance
NEXT_PUBLIC_DEPLOYMENT=DEVELOPMENT

```

## Quickstart Guide
This may not be that helpful but for now I am just going to list everything I do to get started. This could all be wrapped in a nice script. Previous scripts I ran can be found [here](https://github.com/lions-mane/tracer-workspace/blob/master/get-contract-addresses.js) and [here](https://github.com/lions-mane/tracer-workspace/blob/master/deploy-contracts.sh). They are pretty basic but they helped a little.

- start local graph-node with docker-compose up. The graph to get started can be found [here](https://thegraph.com/docs/).
- start local rpc with ganache-cli with 
	`ganache-cli --mnemonic \"mnemonic\" --port 8545 --gasLimit=0x1fffffffffffff --host 0.0.0.0"`
- deploy contracts
- copy trader address into executioner .env file
- start the [executioner](https://github.com/tracer-protocol/executioner)
- start the [tracer-ome](https://github.com/tracer-protocol/tracer-ome)
- copy factory address into the [tracer-graphs](https://github.com/lions-mane/tracer-graphs) /config/tracer-local.json (do not worry about the other addresses)
- run a few scripts [tracer-graphs](https://github.com/lions-mane/tracer-graphs) 
	- `npm run prepare:tracer:local || yarn prepare:tracer:local`
	- `npm run create:tracer:local || yarn create:tracer:local`
	- `npm run deploy:tracer:local || yarn deploy:tracer:local`


## Running

`npm run dev` or `yarn dev`
