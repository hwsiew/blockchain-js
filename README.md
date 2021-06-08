# Blockchain in Javascript

The blockchain implementation using javascript.

## Installation
Using npm:
```
$ npm install simplychain
```

## How to
```javascript
// Import the module
const { SimplyChain } = require('simplychain');

// Create your awesome block chain
let myBlockChain = new SimplyChain();

// Get the last appended block in the chain
// because we haven't added any block yet so the only block in the chain is genesis block
let genesisBlock = myBlockChain.lastBlock;
console.log(genesisBlock);

// Add transaction 
let transaction = {
	from: 'A',
	to: 'B',
	amount: '100'
};
myBlockChain.addTransaction(transaction);

// Get the latest block. This will put all current transactions into a block which can be mined to append to the chain. 
let block = myBlockChain.pendingBlock;

block.mineSync( () => {
	// proof of work
	let nonce = block.nonce;
	
	// append the latest block to the chain
	myBlockChain.addBlock(nonce);

	// validate the chain is valid
	let valid = myBlockChain.validate();

	console.log('Successfully mined a block!', nonce, valid);
});

```

