import crypto from 'crypto';

export class SimplyBlock {
	_index: number;
	_timestamp: number;
	_data: Array<any>;						/*  */
	_nonce: number;					/* nonce number for hashing */
	_previous_hash: string ;  /* hash of previous block */
	_difficulty: number;			/* hash difficulty */

	/**
	 * Create a block
	 * @param {number} index 0-based index of the block 
	 * @param {number} timestamp timestamp of the block
	 * @param {*} data data to be added to the block
	 * @param {string} previous_hash hash of the previous block
	 */
	constructor(index: number, timestamp: number, data: Array<any>, previous_hash: string = ''){
		this._index = index;
		this._timestamp = timestamp;
		this._data = data;
		this._nonce = 0;
		this._previous_hash = previous_hash;
		this._difficulty = 4;
	}

	/**
	 * @type {number} 
	 */
	get nonce(){
		return this._nonce;
	}

	set nonce(value){
		if(typeof value !== 'number' || value < 0)
			throw 'Invalid nonce value';
		this._nonce = value;
	}

	/**
	 * @type {?string} 
	 */
	 get previousHash(){
		return this._previous_hash;
	}

	set previousHash(value){
		this._previous_hash = value;
	}

	/**
	 * @type {number}
	 */
	 get difficulty(){
		return this._difficulty;
	}

	set difficulty(value){
		if(typeof value !== 'number' || value < 0)
			throw 'Invalid difficulty value';
		this._difficulty = value;
	}

	/**
	 * Hash the block
	 * @returns {string}
	 */
	 hash() : string {

		let message = '' + this._index;
		message += this._timestamp;
		message += JSON.stringify(this._data);
		message += this._previous_hash;
		message += this._nonce;

		return crypto.createHash('sha256').update(message).digest('hex');

	}

	/**
	 * Mine a block asyncronusly
	 * @returns {Promise}
	 */
	async mineAsync(){

		let that = this;
		return new Promise(function(resolve){

			while(that.hash().substring(0,that.difficulty) !== Array(that.difficulty).fill('0').join('')){

				that._nonce++;
			}

			resolve(that._nonce);

		});
		
	}

	/**
	 * Mine the block synchronously
	 * @param {function} callback optional callback when successfully mined
	 * @returns {number} the nonce of the block
	 */
	 mineSync(fn?: (nonce: number) => void ): number{
		while(this.hash().substring(0,this._difficulty) !== Array(this._difficulty).fill('0').join('')){
			this._nonce++;
		}
		if(fn) fn(this._nonce);
		return this._nonce;
	}

}