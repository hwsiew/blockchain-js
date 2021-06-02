const SHA256 = require('crypto-js/sha256');

class SimplyBlock{
	/**
	 * Create a block
	 * @param {number} index 
	 * @param {number} timestamp 
	 * @param {object} data 
	 * @param {string} previous_hash 
	 */
	constructor(index, timestamp, data, previous_hash = null){
		this._index = index;
		this._timestamp = timestamp;
		this._data = data;
		this._nonce = 0;
		this._previous_hash = previous_hash;
		this._difficulty = 4;
	}

	/**
	 * @param {number} value - positive value
	 * @throws Invalid nonce value if value is not a number or < 0
	 */
	set nonce(value){
		if(typeof value !== 'number' || value < 0)
			throw 'Invalid nonce value';
		this._nonce = value;
	}

	/**
	 * @returns {number} > 0
	 */
	get nonce(){
		return this._nonce;
	}

	get previousHash(){
		return this._previous_hash;
	}

	set previousHash(value){
		this._previous_hash = value;
	}

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
	hash(){

		let message = '' + this._index;
		message += this._timestamp;
		message += JSON.stringify(this._data);
		message += this._previous_hash;
		message += this._nonce;

		return SHA256(message).toString();

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
	 * @param {?function} callback 
	 * @returns {number} the nonce
	 */
	mineSync(callback = null){
		while(this.hash().substring(0,this._difficulty) !== Array(this._difficulty).fill('0').join('')){
			this._nonce++;
		}
		if(callback) callback(this._nonce);
		return this._nonce;
	}

}

module.exports = {
	SimplyBlock
};