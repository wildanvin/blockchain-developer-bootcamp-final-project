//Check for Metamask

window.addEventListener('load', function() {
  
  if (typeof window.ethereum !== 'undefined') {
    console.log('window.ethereum is enabled')
    if (window.ethereum.isMetaMask === true) {
      console.log('MetaMask is active')
      let mmDetected = document.getElementById('mm-detected')
      mmDetected.innerHTML += 'MetaMask Is Available!'

      // add in web3 here
      var web3 = new Web3(window.ethereum)

    } else {
      console.log('MetaMask is not available')
      let mmDetected = document.getElementById('mm-detected')
      mmDetected.innerHTML += 'MetaMask Not Available!'
      
    }
  } else {
    console.log('window.ethereum is not found')
    let mmDetected = document.getElementById('mm-detected')
    mmDetected.innerHTML += 'MetaMask Not Available!'
  }
})



//Connect to network
var web3 = new Web3(window.ethereum)

const mmEnable = document.getElementById('mm-connect');

mmEnable.onclick = async () => {
  await ethereum.request({ method: 'eth_requestAccounts'})
  // grab mm-current-account
  // and populate it with the current address
  var mmCurrentAccount = document.getElementById('mm-current-account');
  mmCurrentAccount.innerHTML = 'Coneccted with address: ' + ethereum.selectedAddress;
}


// web 3 Interactions with the contract:

let deployBet = document.getElementById('deploy-bet');

deployBet.onclick = async () => {
  await ethereum.request({ method: 'eth_requestAccounts'})
  let p1 = ethereum.selectedAddress
  let p2 = document.getElementById('p2-address').value;
  let numberOfTimeUnits = document.getElementById('number-of-time-units').value;
  let timeUnits = document.getElementById('time-units').value;
  let asset = document.getElementById('asset').value;

  let bettingAmount = (document.getElementById('betting-amount').value * 10e17).toString();
  
  let p1predictedValue = document.getElementById('p1-predicted-value').value;

  var web3 = new Web3(window.ethereum);
  
  const betFactory = new web3.eth.Contract(betFactoryABI, betFactoryAddress);
  betFactory.setProvider(window.ethereum);
  
  await betFactory.methods.createAndSendEther(
    p1, 
    p2,
    numberOfTimeUnits,
    timeUnits,
    bettingAmount,
    asset,
    p1predictedValue
    ).send({from: ethereum.selectedAddress, 
      value:web3.utils.toBN(bettingAmount)
    });
    
}


let seeBet = document.getElementById("m2-see-bet");

seeBet.onclick = async () => {
  
  var web3 = new Web3(window.ethereum);

  const betFactory = new web3.eth.Contract(betFactoryABI, betFactoryAddress);
  betFactory.setProvider(window.ethereum);

  let betNumber = document.getElementById("m2-bet-number").value;
  
  let betRequested = await betFactory.methods.getBet(betNumber).call();

  let p1 = betRequested[0];
  let p2 = betRequested[1];
  let dueDate = betRequested[2];
  //let bettingAmount = betRequested[3];
  //let asset = betRequested[4];
  let p1predictedValue = betRequested[5];
  let p2predictedValue = betRequested[6];
  let betBalance = betRequested[7];
  let betRequestedAddress = betRequested[8];

  document.getElementById("m2-p1").value = p1;
  document.getElementById("m2-p2").value = p2;
  document.getElementById("m2-due-time").value = dueDate;
  //document.getElementById("m2-betting-amount").value = bettingAmount;
  document.getElementById("m2-balance").value = web3.utils.fromWei(
    betBalance,
    "ether"
  );
  document.getElementById("m2-p1-predicted").value = p1predictedValue;
  document.getElementById("m2-p2-predicted").value = p2predictedValue;
  document.getElementById("m2-bet-address").value = betRequestedAddress;
  
  const betOnChain = new web3.eth.Contract(betABI, betRequestedAddress);
  betOnChain.setProvider(window.ethereum);

  let betState = await betOnChain.methods.betState().call();
  let m2State = document.getElementById("m2-state");
  if (betState == 0){
    m2State.innerHTML="State: Waiting for player 2"
  } else if (betState == 1){
    m2State.innerHTML="State: Bet agreed. Let's see who wins"
  } else if (betState == 2){
    m2State.innerHTML='State: Bet finished. Go to "Check bet"'
  }
};

let enterBet = document.getElementById('enter-bet');

enterBet.onclick = async () => {
  //let bettingAmount = document.getElementById('m2-betting-amount').value;
  let bettingAmount = (document.getElementById('m2-balance').value * 10e17).toString();
  let betAddress = document.getElementById('m2-bet-address').value;
  let p2predictedValue = document.getElementById('m2-p2-predicted').value;
  
  var web3 = new Web3(window.ethereum);
  
  const betInstance = new web3.eth.Contract(betABI, betAddress);
  betInstance.setProvider(window.ethereum);

  await betInstance.methods.p2UpdatePredictedValueAndDeposit(
    p2predictedValue).send({
      from: ethereum.selectedAddress, 
      //value:bettingAmount
      value:web3.utils.toBN(bettingAmount)
    });

/*
let bettingAmount = (document.getElementById('betting-amount').value * 10e17).toString();


send({from: ethereum.selectedAddress, 
      value:web3.utils.toBN(bettingAmount)
    });
*/
}

let checkBet = document.getElementById("m3-check-bet");

checkBet.onclick = async () => {
  var web3 = new Web3(window.ethereum);

  const betFactory = new web3.eth.Contract(betFactoryABI, betFactoryAddress);
  betFactory.setProvider(window.ethereum);

  let betNumber = document.getElementById("m3-bet-number").value;

  let betRequested = await betFactory.methods.getBet(betNumber).call();

  let p1 = betRequested[0];
  let p2 = betRequested[1];
  let dueDate = betRequested[2];
  //et bettingAmount = betRequested[3];
  //let asset = betRequested[4];
  let p1predictedValue = betRequested[5];
  let p2predictedValue = betRequested[6];
  let betBalance = betRequested[7];
  let betRequestedAddress = betRequested[8];

  document.getElementById("m3-p1").value = p1;
  document.getElementById("m3-p2").value = p2;
  document.getElementById("m3-due-time").value = dueDate;
  //document.getElementById("m3-balance").value = bettingAmount;
  document.getElementById("m3-balance").value = web3.utils.fromWei(
    betBalance,
    "ether"
  );
  document.getElementById("m3-p1-predicted").value = p1predictedValue;
  document.getElementById("m3-p2-predicted").value = p2predictedValue;
  document.getElementById("m3-bet-address").value = betRequestedAddress;
};


let checkWinner = document.getElementById('check-winner');

checkWinner.onclick = async () => {
  let betAddress = document.getElementById('m3-bet-address').value;
  let p1predictedValue = document.getElementById('m3-p1-predicted').value * 10e7;
  let p2predictedValue = document.getElementById('m3-p2-predicted').value * 10e7;
  //let testChainLink = 6000;
  //console.log(p1predictedValue, p2predictedValue) 
  
  var web3 = new Web3(window.ethereum);
  
  const betInstance = new web3.eth.Contract(betABI, betAddress);
  betInstance.setProvider(window.ethereum);
  
  await betInstance.methods.calculateWinner(
    p1predictedValue,
    p2predictedValue,
    //testChainLink
  ).send({from: ethereum.selectedAddress});
    

  /*
  let price = await betInstance.methods.calculateWinner().call();
  console.log(price);
   */ 

}

//***************************************MODAL 1*********************************** */
// Get the modal
var modal1 = document.getElementById("modal1");

// Get the button that opens the modal
var btn1 = document.getElementById("button-modal-1");

// Get the <span> element that closes the modal
var span1 = document.getElementById("span-1");

// When the user clicks on the button, open the modal
btn1.onclick = function() {
  modal1.style.display = "block";
  var p1Address = document.getElementById('p1-address');
  p1Address.innerHTML += ethereum.selectedAddress

}

// When the user clicks on <span> (x), close the modal
span1.onclick = function() {
  modal1.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal1) {
    modal1.style.display = "none";
    modal2.style.display = "none";
  }
}

//***************************************MODAL 2*********************************** */
// Get the modal
var modal2 = document.getElementById("modal2");

// Get the button that opens the modal
var btn2 = document.getElementById("button-modal-2");

// Get the <span> element that closes the modal
var span2 = document.getElementById("span-2");

// When the user clicks on the button, open the modal
btn2.onclick = function() {
  modal2.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span2.onclick = function() {
  modal2.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal2) {
    modal1.style.display = "none";
    modal2.style.display = "none";
  }
}

//***************************************MODAL 3*********************************** */
// Get the modal
var modal3 = document.getElementById("modal3");

// Get the button that opens the modal
var btn3 = document.getElementById("button-modal-3");

// Get the <span> element that closes the modal
var span3 = document.getElementById("span-3");

// When the user clicks on the button, open the modal
btn3.onclick = function() {
  modal3.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span3.onclick = function() {
  modal3.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal2) {
    modal3.style.display = "none";
  }
}




// contract address:
const betFactoryAddress = '0xdE800752cD65179329bbe00035a63e37dEe59498'

const betABI = [
  {
    "inputs": [
      {
        "internalType": "address payable",
        "name": "_p1",
        "type": "address"
      },
      {
        "internalType": "address payable",
        "name": "_p2",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_numberOfTimeUnits",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_timeUnits",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_bettingAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_asset",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_p1predictedValue",
        "type": "uint256"
      }
    ],
    "stateMutability": "payable",
    "type": "constructor",
    "payable": true
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "score1",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "score2",
        "type": "uint256"
      }
    ],
    "name": "Scores",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "asset",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "betAddress",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "betState",
    "outputs": [
      {
        "internalType": "enum Bet.BetState",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "bettingAmount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "dueDate",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "getLatestPrice",
    "outputs": [
      {
        "internalType": "int256",
        "name": "",
        "type": "int256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "numberOfTimeUnits",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "p1",
    "outputs": [
      {
        "internalType": "address payable",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "p1predictedValue",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "p2",
    "outputs": [
      {
        "internalType": "address payable",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "p2predictedValue",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "timeUnits",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [],
    "name": "winnerIs",
    "outputs": [
      {
        "internalType": "enum Bet.WinnerIs",
        "name": "",
        "type": "uint8"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "stateMutability": "payable",
    "type": "receive",
    "payable": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_p2predictedValue",
        "type": "uint256"
      }
    ],
    "name": "p2UpdatePredictedValueAndDeposit",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function",
    "payable": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_p1",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_p2",
        "type": "uint256"
      }
    ],
    "name": "calculateWinner",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "a",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "b",
        "type": "uint256"
      }
    ],
    "name": "positiveSubstraction",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "pure",
    "type": "function",
    "constant": true
  }
];

const betFactoryABI =  [
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "bets",
    "outputs": [
      {
        "internalType": "contract Bet",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  },
  {
    "inputs": [
      {
        "internalType": "address payable",
        "name": "_p1",
        "type": "address"
      },
      {
        "internalType": "address payable",
        "name": "_p2",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_numberOfTimeUnits",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_timeUnits",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_bettingAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_asset",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "_p1predictedValue",
        "type": "uint256"
      }
    ],
    "name": "createAndSendEther",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function",
    "payable": true
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_index",
        "type": "uint256"
      }
    ],
    "name": "getBet",
    "outputs": [
      {
        "internalType": "address payable",
        "name": "p1",
        "type": "address"
      },
      {
        "internalType": "address payable",
        "name": "p2",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "dueDate",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "bettingAmount",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "asset",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "p1predictedValue",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "p2predictedValue",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "balance",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "betAddress",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function",
    "constant": true
  }
];