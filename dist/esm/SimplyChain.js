import { SimplyBlock } from "./SimplyBlock";
var SimplyChain = /** @class */ (function () {
    /**
     * Create SimplyChain
     */
    function SimplyChain() {
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
    Object.defineProperty(SimplyChain.prototype, "lastBlock", {
        /**
         * Get the recent/last block in the chain
         * @type {SimplyBlock}
         */
        get: function () {
            return this._lastblock;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SimplyChain.prototype, "length", {
        /**
         * Get the length of the chain
         * @type {number}
         */
        get: function () {
            return this._length;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SimplyChain.prototype, "pendingBlock", {
        /**
         * Get the block pending to be added in chain
         * @type {?SimplyBlock}
         */
        get: function () {
            // if not pendingblock and have transaction
            if (!this._pendingBlock && this._transactions.length)
                this.createBlock();
            return this._pendingBlock;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(SimplyChain.prototype, "theChain", {
        /**
         * Get the complete chain
         * @type {object.<string, SimplyBlock>}
         */
        get: function () {
            return this._chain;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Create the first block of the chain
     */
    SimplyChain.prototype.createGenesisBlock = function () {
        var index = 0;
        var timestamp = (new Date()).getTime();
        var data = ['Genesis block for the SimplyChain'];
        var previous_hash = '0';
        var block = new SimplyBlock(index, timestamp, data, previous_hash);
        block.mineSync();
        var hash = block.hash();
        this._chain[hash] = [block];
        this._length++;
        return block;
    };
    /**
     * Add a block into the chain
     * @param {number} proofOfWork
     * @throws Invalid block | Invalid proof of work
     */
    SimplyChain.prototype.addBlock = function (proofOfWork) {
        if (!this._pendingBlock)
            throw 'No block to be added!';
        var block = this._pendingBlock;
        block.nonce = proofOfWork;
        var last_hash = this._lastblock.hash();
        if (block.previousHash !== last_hash)
            throw 'Invalid block!';
        var block_hash = block.hash();
        if (block_hash.substring(0, this._difficulty) !== Array(this._difficulty).fill('0').join(''))
            throw 'Invalid proof of work!';
        if (!(block_hash in this._chain))
            this._chain[block_hash] = [];
        this._chain[block_hash].push(block);
        this._lastblock = block;
        this._length++;
        this._pendingBlock = undefined;
    };
    /**
     * Check if the chain is valid
     * @returns {boolean} if the chain is valid or not
     */
    SimplyChain.prototype.validate = function () {
        var current = this._lastblock;
        var previous = this._chain[current.previousHash];
        var count = this._length - 1; // exclude genesis blcok
        while (previous) {
            var block = previous[0]; // todo: hash collition
            var difficulty = current.difficulty;
            if (current.hash().substring(0, difficulty) !== Array(difficulty).fill('0').join(''))
                return false;
            if (block.hash() !== current.previousHash)
                return false;
            current = block;
            previous = this._chain[current.previousHash];
            count--;
        }
        return count === 0 ? true : false;
    };
    /**
     * add a transaction to chain
     * @param {*} data
     */
    SimplyChain.prototype.addTransaction = function (data) {
        this._transactions.push(data);
    };
    /**
     * Enlist all pending transaction into a block
     */
    SimplyChain.prototype.createBlock = function () {
        var transactions = this._transactions;
        var index = this._length;
        var timestamp = (new Date()).getTime();
        var lastblock = this._lastblock;
        this._pendingBlock = new SimplyBlock(index, timestamp, transactions, lastblock.hash());
        this._pendingBlock.difficulty = this._difficulty;
        // reset transactions
        this._transactions = [];
    };
    return SimplyChain;
}());
export { SimplyChain };
