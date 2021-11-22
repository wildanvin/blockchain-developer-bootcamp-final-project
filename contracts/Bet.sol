// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.3;

import "./PriceConsumerV3.sol";

contract Bet is PriceConsumerV3{
    
    address payable public p1; //player 1
    address payable public p2; //player 2
    
    address public betAddress;
    
    /*
    this will be the date that the generated contract will check who wins
    hopefully we can use chainlink Keepers to do it. That would be awesome.
    We will use the blockchain time because i think it is enough.
    Not entirely sure on how to implemented. Maybe with some cooldown periods
    */
    uint public dueDate;
    
    /*
    This is the money you are betting.
    There should be a function that gets this amount of money from both players.
    The function only accepts ether
    */
    uint public bettingAmount;
    
    /*
    For now, we can only bet on the price of ETH
    number 1 for ETH
    */
    uint public asset;
    
    /*
    Predicted value of player1. 
    It only should be changed by player1 address.
    After deployed it can not be changed by anyone. NOT EVEN PLAYER1
    */
    uint public p1predictedValue;
    
    /*
    Similar to p1predictedValue. This is the predicted value of player2
    It only should be changed by player2 address after player1 deploys the contract
    After entering the p2predictedValued and Accepting the value cant be changed by anyone, not even player2
    */
    uint public p2predictedValue;
    
    uint numberOfTimeUnits;
    uint timeUnits;

    constructor (address payable _p1, 
                address payable _p2,
                uint _numberOfTimeUnits,
                uint _timeUnits,
                uint _bettingAmount,
                uint _asset,
                uint _p1predictedValue
                //uint _p2predictedValue
                ) 
                
        payable      
    {
        p1 = _p1;
        p2 = _p2;
        numberOfTimeUnits = _numberOfTimeUnits;
        timeUnits = _timeUnits;
        bettingAmount = _bettingAmount;
        asset = _asset;
        p1predictedValue = _p1predictedValue;
        p2predictedValue = 0;
        betAddress = address(this);

        if (timeUnits == 1){ //minutes
            dueDate = block.timestamp + (numberOfTimeUnits * 1 minutes);  
        } else if (timeUnits == 2){ //hours 
            dueDate = block.timestamp + (numberOfTimeUnits * 1 hours);    
        } else if (timeUnits == 3){//days
            dueDate = block.timestamp + (numberOfTimeUnits * 1 days);    
        }else if (timeUnits == 4){//weeks
            dueDate = block.timestamp + (numberOfTimeUnits * 1 weeks);    
        }else if (timeUnits == 5){//months
            dueDate = block.timestamp + (numberOfTimeUnits * 4 weeks);    
        }
    }
    
    /*
    notDeployed: the bet is not deployed by player1
    waitingP2: the bet is waiting for player2 to match the bettingAmount of player1
                if player2 doesnt deposit player1 should receive back his bettingAmount
    agreed: player1 and player2 have deposited the bettingAmount
    finished: the dueDate has passed there must be a winner
    
    */
    enum BetState {waitingP2, agreed, finished }
    BetState public betState; 
    
    
    /*
    In this enum we will update who is the winner
    */
    enum WinnerIs {notKnownYet, player1, player2, draw}
    WinnerIs public winnerIs;
    
    /*
    for this mapping the front end will have a list where to display the assets
    1 => bitcoin address oracle in chainlink
    2 => ether address oracle in chainlink
    3 => bnb address oracle in chainlink
    */
    mapping(uint => address) public chainlinkAddress; 
    
    /*
    the function receivingBettingAmount should receive the bettingAmount of Player 2
    As a remainder the value bettingAmount and the ETH player 1 ib betting is set in the constructor of the bet
    The bettingAmount of both players are equal
    */
    function p2UpdatePredictedValueAndDeposit (uint _p2predictedValue) public payable {
        require(msg.value >= bettingAmount, "Should deposit exact betting amount");
        p2predictedValue = _p2predictedValue;
        //after player2 deposits we should check bettingAmount == 2*_bettingAmount
    }
    
    /*
    After the dueDate period this function will be called only by Player1 or Player2
    The player closer to the value that retrieves chainlink at dueDate will get the bettingAmount * 2
    If there is a tie the players will get their money back minus fees
    */
    function calculateWinner (uint _p1, uint _p2, uint _testChainlinkValue ) public {
        uint priceAtDueDate = _testChainlinkValue; // this is the price provided by chainlink
        uint p1Score = positiveSubstraction(priceAtDueDate, _p1);
        uint p2Score = positiveSubstraction(priceAtDueDate, _p2);
        if (p1Score < p2Score){
            // The winner is p1!
            betState = BetState.finished;
            winnerIs = WinnerIs.player1;
            uint amount = address(this).balance;
            (bool success, ) = p1.call{value: amount}("");
            require(success, "Failed to send Ether");
        } else if (p2Score < p1Score){
            // The winner is p2!
            betState = BetState.finished;
            winnerIs = WinnerIs.player2;
            uint amount = address(this).balance;
            (bool success, ) = p2.call{value: amount}("");
            require(success, "Failed to send Ether");
        } else if (p1Score == p2Score){
            // It is a draw!
            betState = BetState.finished;
            winnerIs = WinnerIs.draw;
            uint amount = address(this).balance;
            (bool success1, ) = p1.call{value: amount/2}("");
            require(success1, "Failed to send Ether");
            (bool success2, ) = p2.call{value: amount/2}("");
            require(success2, "Failed to send Ether");
        }
    }
    

    /*
    function helper to get a positive value in a substraction. 
    */
    function positiveSubstraction (uint a, uint b) public pure returns (uint){
        if (a < b){
            return (b-a);
        } else {
            return (a-b);
        }
        
    }

    receive() external payable {}
}
