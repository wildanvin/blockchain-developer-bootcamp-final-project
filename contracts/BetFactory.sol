// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.3;
import "./Bet.sol";

contract BetFactory{
    
    Bet[] public bets;
    
    
    function createAndSendEther(
                address payable _p1, 
                address payable _p2,
                //uint _dueDate,
                uint _numberOfTimeUnits,
                uint _timeUnits,
                uint _bettingAmount,
                uint _asset,
                uint _p1predictedValue
                //uint _p2predictedValue
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
        //_p2predictedValue
        );
        
        bets.push(bet);
    }
    
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











