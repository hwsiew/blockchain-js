const { SimplyChain } = require('../dist/cjs/SimplyChain');
const { it, expect } = require('@jest/globals');

it('should initialize genesis block',function(){
	let blockchain = new SimplyChain();
	expect(blockchain.validate()).toBeTruthy();
	let block = blockchain.lastBlock;
	expect(block._index).toEqual(0);
});

it('should add a new block',function(){
	let blockchain = new SimplyChain();
	blockchain.addTransaction('hello');
	let block = blockchain.pendingBlock;
	
	expect.assertions(2);
	return block.mineAsync()
		.then(nonce => {
			blockchain.addBlock(nonce);
			expect(blockchain.validate()).toBeTruthy();
			expect(blockchain.length).toBe(2);
		});

});

it('should add multiple blocks',function(){
	let blockchain = new SimplyChain();
	blockchain.addTransaction('hello');
	let block = blockchain.pendingBlock;

	blockchain.addTransaction('hello 1');
	blockchain.addTransaction('hello 2');
	blockchain.addTransaction('hello 3');
	
	expect.assertions(4);
	return block.mineAsync()
		.then(nonce => {
			blockchain.addBlock(nonce);
			expect(blockchain.validate()).toBeTruthy();
			expect(blockchain.length).toBe(2);
			
			block = blockchain.pendingBlock;
			return block.mineAsync();
		})
		.then(nonce => {
			blockchain.addBlock(nonce);
			expect(blockchain.validate()).toBeTruthy();
			expect(blockchain.length).toBe(3);
		});

});