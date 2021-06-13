// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract MutualityToken is Initializable, ERC20Upgradeable {
    uint256 private value;
    function initialize(uint256 initialSupply) public virtual initializer {
        __ERC20_init("Mutuality", "Mu");
        _mint(msg.sender, initialSupply);
    }
    function retrieve() public view returns (uint256) {
        return value;
    }
    function store(uint256 newValue) public {
        value = newValue;
    }
}