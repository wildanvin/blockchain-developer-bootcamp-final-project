// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.3;

import "./Bet.sol";

/// @title The Bet Factory contract
/// @author Wilman D. Vinueza
/// @notice This is the contract that will create and stores all the bets
/// @dev This is the contract that the user will interact with
contract BetFactory{
    
    ///@notice In this array the bets will be stored
    Bet[] public bets;
    
    /// @notice With this function the player 1 will create a bet and deposit te betting amount
    /// @param _p1 Address of player 1
    /// @param _p2 Address of player 2
    /// @param _numberOfTimeUnits In "5 hours", numberOfTimeUnits would be "5"
    /// @param _timeUnits In "5 hours", timeUnits would be "hours"
    /// @param _asset The asset price you would be betting on
    /// @param _p1predictedValue Predicted value of player 1
    function createAndSendEther(
                address payable _p1, 
                address payable _p2,
                uint _numberOfTimeUnits,
                uint _timeUnits,
                uint _bettingAmount,
                uint _asset,
                uint _p1predictedValue
                ) 
        public 
        payable 
        
    {
        Bet bet = (new Bet){value: msg.value}(
        _p1,
        _p2,
        _numberOfTimeUnits,
        _timeUnits,
        _bettingAmount,
        _asset,
        _p1predictedValue
        );
        
        bets.push(bet);
    }
    
    /// @notice This function will retrieve the info of each bet
    /// @param _index The index in the bets array
    function getBet(uint _index)
        public
        view
        returns (
            address payable p1, 
            address payable p2,
            uint dueDate,
            uint bettingAmount,
            uint asset,
            uint p1predictedValue,
            uint p2predictedValue,
            uint balance,
            address betAddress
        )
    {
        Bet bet = bets[_index];
        
        return (
            bet.p1(),
            bet.p2(),
            bet.dueDate(),
            bet.bettingAmount(),
            bet.asset(),
            bet.p1predictedValue(),
            bet.p2predictedValue(),
            address(bet).balance,
            bet.betAddress()
        );
        
    }
}











