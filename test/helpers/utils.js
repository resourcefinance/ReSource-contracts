// web3 is inited in truffle
const Promise = require('bluebird');
const updatedDiff = require('deep-object-diff').updatedDiff;
const inspect = require('util').inspect;
const bn = (input) => web3.utils.toBN(input);
const assertBNequal = (bnOne, bnTwo, message) => assert.equal(bnOne.toString(), bnTwo.toString(), message);

const tokenAsserts = (mutual, accounts) => {
  const assertBalance = async (user, balance, creditBalance) => {
    assertBNequal(await mutual.balanceOf(user), balance, `${user} balance mismatch`);
    assertBNequal(await mutual.creditBalanceOf(user), creditBalance, `${user} credit balance mismatch`);
  };
};

module.exports = {
  bn,
  assertBNequal,
  tokenAsserts,
};
