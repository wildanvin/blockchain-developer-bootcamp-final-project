// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.3;

contract Bet{
    
    uint public num;
    address public sender;
    uint public value;
    
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
    There will be will be 3 assets to bet only
    1. bitcoin
    2. ether
    3. link
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
    
    
    constructor(address payable _p1, 
                address payable _p2,
                uint _dueDate,
                uint _bettingAmount,
                uint _asset,
                uint _p1predictedValue,
                uint _p2predictedValue
                ) 
                
                payable {
                p1 = _p1;
                p2 = _p2;
                dueDate = _dueDate;
                bettingAmount = _bettingAmount;
                asset = _asset;
                p1predictedValue = _p1predictedValue;
                p2predictedValue = _p2predictedValue;
                betAddress = address(this);
    }
    
    
    
    
    /*
    notDeployed: the bet is not deployed by player1
    waitingP2: the bet is waiting for player2 to match the bettingAmount of player1
                if player2 doesnt deposit player1 should receive back his bettingAmount
    agreed: player1 and player2 have deposited the bettingAmount
    finished: the dueDate has passed there must be a winner
    
    */
    enum BetState { notDeployed, waitingP2, agreed, finished }
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
    the function receivingBettingAmount should receive the bettingAmount of ONLY both players
    it should check the bettingAmount of both players are equal
    I guess that when the contract is first initialized it just accept the betting amount of p1.
    Once it is deloyed only p2 can call this function. We can do that with a modifier
    Only the players should be able to deposit
    */
    function receiveBettingAmount () public payable {
        //require(bettingAmount == msg.value);
        
        //after player2 deposits we should check bettingAmount == 2*_bettingAmount
    }
    
    
    /*
    After the dueDate period this function will be called automatically by the Keepers network of chainlink hapefuly
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
    
    
    

    function setVars(address _contract, uint _num) public payable {
        
        (bool success, bytes memory data) = _contract.delegatecall(
            abi.encodeWithSignature("setVars(uint256)", _num)
        );
    }
    
    
    
    
    
    
    /*
    function setBettingAmount (uint _x) public {
        bettingAmount = _x;
    }
    
    function setP1predictedValue (uint _x) public {
        p1predictedValue = _x;
    }
    
    function setP2predictedValue (uint _x) public {
        p2predictedValue = _x;
    }
    
    function setP1Address (address payable _x) public {
        p1 = _x;        
    }
    
    function setP2Address (address payable _x) public {
        p2 = _x;        
    }
    */
}
