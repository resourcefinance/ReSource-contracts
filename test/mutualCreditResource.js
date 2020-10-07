const Ganache = require('./helpers/ganache');

const MutualCreditResource = artifacts.require('MutualCreditResource');

contract('MutualCreditResource', function(accounts) {
  const ganache = new Ganache(web3);
  afterEach('revert', ganache.revert);

  const bn = (input) => web3.utils.toBN(input);
  const assertBNequal = (bnOne, bnTwo) => assert.equal(bnOne.toString(), bnTwo.toString());

  const name = 'Mutual Credit Resource System';
  const symbol = 'MCRS';
  const decimals = 6;

  let mcrs;

  before('setup others', async function() {
    mcrs = await MutualCreditResource.new();

    await ganache.snapshot();
  });

  it('should set default owner after contract deploy', async function() {
    assert.equal(await mcrs.owner(), accounts[0]);
  });

  it('should set name, symbol and default decimals = 6 after contract deploy', async function() {
    assert.equal(await mcrs.name(), name);
    assert.equal(await mcrs.symbol(), symbol);
    assert.equal(await mcrs.decimals(), decimals);
  });

  it('should have default 0 total supply', async function() {
    assertBNequal(await mcrs.totalSupply(), bn('0'));
  });
});
