const { SimplyChain } = require('./src/SimplyChain');

const instance = new SimplyChain();
Object.freeze(instance);

module.exports = {
	SimplyChain : instance
}