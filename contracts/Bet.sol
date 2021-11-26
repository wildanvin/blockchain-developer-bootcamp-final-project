// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.3;

import "./PriceConsumerV3.sol";

/// @title The Bet contract
/// @author Wilman D. Vinueza
/// @notice This is the template contract that will hold the funds and the data of each bet.
/// @dev This is the template contract the user will create every time it interacts with the BetFactory.sol contract
/// @dev This contract inherits from the PriceConsumerV3.sol in order to access the price of ETH. 
contract Bet is PriceConsumerV3{
    
    /// @notice Address of player 1
    address payable public p1;
    
    /// @notice Address of player 2
    address payable public p2; 
    
    /// @notice The address of "this" bet
    address public betAddress;
    
    /// @notice The amount of money (in ETH) each player is betting
    uint public bettingAmount;
    
    /// @notice The asset in wich you are betting. 
    /// @dev This value will be used for future updates because right now you can only bet about the price of ETH
    uint public asset;
    
    /// @notice The predicted value of player 1
    uint public p1predictedValue;
    
    /// @notice The predicted value of player 2
    uint public p2predictedValue;

    /// @notice In "5 hours", numberOfTimeUnits would be "5"
    uint public numberOfTimeUnits;

    /// @notice In "5 hours", timeUnits would be "hours"
    /// @notice timeUnits can be minutes, hours, days, weeks or months
    uint public timeUnits;

    /// @notice This is the time in the future at wich the players will see who won
    /// @dev dueDate is calculated from the numberOfTimeUnits and timeUnits variables
    uint public dueDate;

    /// @dev At the end of this constructor there are "if" statements to calculate de dueDate based on the user input 
    constructor (
                address payable _p1, 
                address payable _p2,
                uint _numberOfTimeUnits,
                uint _timeUnits,
                uint _bettingAmount,
                uint _asset,
                uint _p1predictedValue
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

        if (timeUnits == 1){ 
            dueDate = block.timestamp + (numberOfTimeUnits * 1 minutes);  
        } else if (timeUnits == 2){ 
            dueDate = block.timestamp + (numberOfTimeUnits * 1 hours);    
        } else if (timeUnits == 3){
            dueDate = block.timestamp + (numberOfTimeUnits * 1 days);    
        }else if (timeUnits == 4){
            dueDate = block.timestamp + (numberOfTimeUnits * 1 weeks);    
        }else if (timeUnits == 5){
            dueDate = block.timestamp + (numberOfTimeUnits * 4 weeks);    
        }
    }
    
    enum BetState {waitingP2, agreed, finished }
    BetState public betState; 
    
    enum WinnerIs {notKnownYet, player1, player2, draw}
    WinnerIs public winnerIs; 
    
    /// @notice Emitted once the calculateWinner function is executed
    /// @param price The price provided by Chainlink
    /// @param score1 The score of player 1
    /// @param score2 The score of player 2
    event Scores (uint price, uint score1, uint score2);

    /// @notice Through this function player 2 sets his predicted value and deposits his bettingAmount
    /// @param _p2predictedValue The predicted value of player 2
    function p2UpdatePredictedValueAndDeposit (uint _p2predictedValue) public payable {
        require (msg.sender == p2, "Only player 2 can enter the bet");
        require(msg.value >= bettingAmount, "Player 2 should deposit at least the betting amount");
        p2predictedValue = _p2predictedValue;
        betState = BetState.agreed;
    }
    
    /// @notice This is the function used the determine who won
    /// @dev The score for each player is: price provided by Chainlink minus the predicted value. The one with the lower score wins
    /// @param _p1 The predicted value of player 1
    /// @param _p2 The predicted value of player 2
    function calculateWinner (uint _p1, uint _p2) public {
        require(betState == BetState.agreed);
        require(msg.sender == p1 || msg.sender == p2);
        require(block.timestamp >= dueDate);

        //uint priceAtDueDate = uint(getLatestPrice()); //comment this line to deploy to testnets. Uncomment to deploy locally
        uint priceAtDueDate = 423830969113; //comment this line to deploy locally. Uncomment to deploy to testnets
        
        uint p1Score = positiveSubstraction(priceAtDueDate, _p1);
        uint p2Score = positiveSubstraction(priceAtDueDate, _p2);
        emit Scores(priceAtDueDate, p1Score, p2Score);

        if (p1Score < p2Score){
            betState = BetState.finished;
            winnerIs = WinnerIs.player1;
            uint amount = address(this).balance;
            (bool success, ) = p1.call{value: amount}("");
            require(success, "Failed to send Ether");
        } else if (p2Score < p1Score){
            betState = BetState.finished;
            winnerIs = WinnerIs.player2;
            uint amount = address(this).balance;
            (bool success, ) = p2.call{value: amount}("");
            require(success, "Failed to send Ether");
        } else if (p1Score == p2Score){
            betState = BetState.finished;
            winnerIs = WinnerIs.draw;
            uint amount = address(this).balance;
            (bool success1, ) = p1.call{value: amount/2}("");
            require(success1, "Failed to send Ether");
            (bool success2, ) = p2.call{value: amount/2}("");
            require(success2, "Failed to send Ether");
        }
    }
    
    /// @notice function helper to get a positive value in a substraction. Similar to an absolute value in math. Seems to work fine 
    function positiveSubstraction (uint a, uint b) public pure returns (uint){
        if (a < b){
            return (b-a);
        } else {
            return (a-b);
        }
        
    }

    receive() external payable {}
}
