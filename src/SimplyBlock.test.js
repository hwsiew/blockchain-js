const { SimplyBlock } = require('./SimplyBlock');
const { it, expect } = require('@jest/globals');
const SHA256 = require('crypto-js/sha256');

it('should hash correctly using SHA256.', function(){

	let index = 1;
	let timestamp = (new Date()).getTime();
	let data = 'testing';
	let previous_hash = '0';

	let message = '' + index;
	message += timestamp;
	message += JSON.stringify(data);
	message += previous_hash;
	message += 0;

	let block = new SimplyBlock(index,timestamp,data,previous_hash);

	expect(block.hash()).toEqual(SHA256(message).toString());

});

it('should mine a block asyncronously', function(){

	let index = 1;
	let timestamp = 1622600980004;
	let data = 'testing';
	let previous_hash = '0';
	let block = new SimplyBlock(index,timestamp,data,previous_hash);

	expect.assertions(1);
	return block.mineAsync().then(nonce => expect(nonce).toEqual(62838));

});

it('should mine a block yncronously', function(done){

	let index = 1;
	let timestamp = 1622600980004;
	let data = 'testing';
	let previous_hash = '0';
	let block = new SimplyBlock(index,timestamp,data,previous_hash);

	block.mineSync(function(data){
		expect(data).toEqual(62838);
		done();
	})

});

it('should work for setting a block difficulty', function(done){

	let index = 1;
	let timestamp = (new Date()).getTime();
	let data = 'testing';
	let previous_hash = '0000d04b3bc59fb098e46fd200f36641b001aeabdef8ce133563eb1f29c396cc';
	let difficulty = 5;

	let block = new SimplyBlock(index,timestamp,data,previous_hash);
	block.difficulty = difficulty;

	block.mineSync(function(){

		expect(block.hash().substring(0,difficulty)).toEqual(Array(difficulty).fill('0').join(''));
		done();
	});

	
});