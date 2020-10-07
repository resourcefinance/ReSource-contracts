// SPDX-License-Identifier: MIT
pragma solidity 0.7.1;
pragma experimental ABIEncoderV2;

import '@openzeppelin/contracts/access/Ownable.sol';
import '@openzeppelin/contracts/math/SafeMath.sol';
import '@openzeppelin/contracts/math/Math.sol';
import '@openzeppelin/contracts/token/ERC20/ERC20Burnable.sol';

library ExtraMath {
    function toUInt128(uint _a) internal pure returns(uint128) {
        require(_a <= uint128(-1), 'uint128 overflow');
        return uint128(_a);
    }
}

contract MutualCreditResource is Ownable, ERC20Burnable {
    using SafeMath for *;
    using ExtraMath for *;

    struct Member {
        uint128 creditBalance;
        uint128 creditLimit;
    }

    mapping(address => Member) private _members;

    event CreditLimitUpdate(address member, uint limit);

    constructor() ERC20('Mutual Credit Resource System', 'MCRS') {
        _setupDecimals(6);
    }

    function creditBalanceOf(address _member) public view returns(uint) {
        return _members[_member].creditBalance;
    }

    function creditLimitOf(address _member) public view returns(uint) {
        return _members[_member].creditLimit;
    }

    function creditLimitLeftOf(address _member) public view returns(uint) {
        Member memory _localMember = _members[_member];
        if (_localMember.creditBalance >= _localMember.creditLimit) {
            return 0;
        }
        return _localMember.creditLimit.sub(_localMember.creditBalance);
    }

    function setCreditLimit(address _member, uint _limit) external onlyOwner() {
        _members[_member].creditLimit = _limit.toUInt128();
        emit CreditLimitUpdate(_member, _limit);
    }

    function _transfer(address _from, address _to, uint _amount) internal override {
        _beforeTransfer(_from, _amount);
        super._transfer(_from, _to, _amount);
        _afterTransfer(_to, _amount);
    }

    function _beforeTransfer(address _from, uint _amount) private {
        uint _balanceFrom = balanceOf(_from);
        if (_balanceFrom >= _amount) {
            return;
        }

        Member memory _memberFrom = _members[_from];
        uint _missingBalance = _amount.sub(_balanceFrom);
        uint _creditLeft = _memberFrom.creditLimit.sub(_memberFrom.creditBalance, 'Insufficient credit');
        require(_creditLeft >= _missingBalance, 'Insufficient credit');
        _members[_from].creditBalance = _memberFrom.creditBalance.add(_missingBalance).toUInt128();
        _mint(_from, _missingBalance);
    }

    function _afterTransfer(address _to, uint _amount) private {
        Member memory _memberTo = _members[_to];
        uint _repay = Math.min(_memberTo.creditBalance, _amount);
        if (_repay == 0) {
            return;
        }
        _members[_to].creditBalance = _memberTo.creditBalance.sub(_repay).toUInt128();
        _burn(_to, _repay);
    }
}
