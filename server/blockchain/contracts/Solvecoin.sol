// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Solvecoin is ERC20, Ownable {
    // Events
    event TokensRewarded(address indexed solver, uint256 amount);

    // Constructor - mint initial supply to contract creator
    constructor(uint256 initialSupply) ERC20("Solvecoin", "SOLVE") Ownable(msg.sender) {
        _mint(msg.sender, initialSupply * (10 ** decimals()));
    }

    // Function to reward solvers with tokens
    function rewardSolver(address solver, uint256 amount) public onlyOwner {
        require(solver != address(0), "Cannot reward zero address");
        require(amount > 0, "Reward amount must be greater than zero");
        
        _transfer(owner(), solver, amount);
        emit TokensRewarded(solver, amount);
    }

    // Additional function to mint more tokens if needed
    function mintTokens(uint256 amount) public onlyOwner {
        require(amount > 0, "Mint amount must be greater than zero");
        _mint(msg.sender, amount * (10 ** decimals()));
    }
}