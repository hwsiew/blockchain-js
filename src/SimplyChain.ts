import { SimplyBlock } from "./SimplyBlock";

interface ChainObject {
	[index: string]: Array<SimplyBlock>;
}

export class SimplyChain{

	_chain: ChainObject;
	_lastblock: SimplyBlock;
	_length: number;
	_difficulty: number;
	_transactions: Array<any>;
	_pendingBlock: SimplyBlock | undefined;

	/**
	 * Create SimplyChain
	 */
	 constructor(){
		// the chain
		this._chain = {};
		// the length of the chain
		this._length = 0;
		// proof of work difficulty
		this._difficulty = 5;
		// all pending transactions
		this._transactions = [];
		// pending block 
		this._pendingBlock;

		// initialize genesis block
		this._lastblock = this.createGenesisBlock();
	}

	/**
	 * Get the recent/last block in the chain
	 * @type {SimplyBlock}
	 */
	 get lastBlock(){
		return this._lastblock;
	}

	/**
	 * Get the length of the chain
	 * @type {number}
	 */
	get length(){
		return this._length;
	}

	/**
	 * Get the block pending to be added in chain 
	 * @type {?SimplyBlock}
	 */
	get pendingBlock(){
		// if not pendingblock and have transaction
		if(!this._pendingBlock && this._transactions.length) 
			this.createBlock();
		return this._pendingBlock;
	}

	/**
	 * Get the complete chain
	 * @type {object.<string, SimplyBlock>}
	 */
	get theChain(){
		return this._chain;
	}

	/**
	 * Create the first block of the chain
	 */
	createGenesisBlock() : SimplyBlock{
		let index = 0;
		let timestamp = (new Date()).getTime();
		let data = ['Genesis block for the SimplyChain'];
		let previous_hash = '0';

		let block = new SimplyBlock(index, timestamp, data, previous_hash);
		block.mineSync();
		let hash  = block.hash();

		this._chain[hash] = [block];
		this._length++;

		return block;
	}

	/**
	 * Add a block into the chain
	 * @param {number} proofOfWork
	 * @throws Invalid block | Invalid proof of work
	 */
	 addBlock(proofOfWork: number){

		if(!this._pendingBlock) throw 'No block to be added!';

		let block = this._pendingBlock;
		block.nonce = proofOfWork;

		let last_hash = this._lastblock.hash();
		if( block.previousHash !== last_hash ) throw 'Invalid block!';

		let block_hash = block.hash();
		if(block_hash.substring(0,this._difficulty) !== Array(this._difficulty).fill('0').join('')) throw 'Invalid proof of work!' 

		if(!(block_hash in this._chain)) this._chain[block_hash] = [];
		
		this._chain[block_hash].push(block);
		this._lastblock = block;
		this._length++;
		this._pendingBlock = undefined;

	}

	/**
	 * Check if the chain is valid
	 * @returns {boolean} if the chain is valid or not
	 */
	validate(){
		let current = this._lastblock;
		let previous = this._chain[current.previousHash];
		let count = this._length - 1; // exclude genesis blcok
		
		while(previous){

			let block = previous[0]; // todo: hash collition

			let difficulty = current.difficulty;

			if(current.hash().substring(0,difficulty) !== Array(difficulty).fill('0').join('')) 
				return false;
	
			if(block.hash() !== current.previousHash) 
				return false;
			
			current  = block;
			previous = this._chain[current.previousHash];
 			count--;
		}

		return count === 0 ? true : false;
	}

	/**
	 * add a transaction to chain
	 * @param {*} data 
	 */
	addTransaction(data: any){
		this._transactions.push(data);
	}

	/**
	 * Enlist all pending transaction into a block
	 */
	createBlock(){

		let transactions = this._transactions;
		let index = this._length;
		let timestamp = (new Date()).getTime();
		let lastblock = this._lastblock;

		this._pendingBlock = new SimplyBlock(index, timestamp, transactions, lastblock.hash());
		this._pendingBlock.difficulty = this._difficulty;

		// reset transactions
		this._transactions = [];

	}
}