const promptTxt= document.getElementById("prompt1");
const namebox = document.getElementById("namebox");
const btn1 = document.getElementById("btn1");
const btn2 = document.getElementById("btn2");
const dealerHandEl = document.getElementById("DealerHand");
const playerHandEl = document.getElementById("PlayerHand");

//Steps
let greetingComplete = false;

//Create deck of cards
const deck = {
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  10: 10,
  Jack: 10,
  Queen: 10,
  King: 10,
  //Ace: 11,
};

  let playerHand = [];
  let dealerHand = [];
  let someoneBust = false;

function dealACard() {
  let randomIndex = Math.floor(Math.random() * 12)
  return Object.keys(deck)[randomIndex]
}

//Return value of passed in hand.
function handValue(handArray) {
  let handValue = 0;
  handArray.forEach(card => {
    handValue += deck[card];
  });
  return handValue;
}

//Return true if the current hand is a bust or false if not.
function bust(handArray) {
  if (handValue(handArray) > 21) {
    return true;
  } else {
    return false;
  }
}

//Prints current hands in text on page.
function declareHands() {
  let dealerHandHTML = '';
  let playerHandHTML = '';
  let showing = '';
  
  dealerHand.forEach(card => {
    dealerHandHTML = dealerHandHTML + `<img src="cards/${card}.png" alt=${card} class="cards">`
  });

  if (dealerHand.length < 2) {
    dealerHandHTML = dealerHandHTML + `<img src="cards/Back.png" alt="Card Back" class="cards">`
  }
  
  playerHand.forEach(card => {
    playerHandHTML = playerHandHTML + `<img src="cards/${card}.png" alt=${card} class="cards">`
  });
  
  dealerHandEl.innerHTML = dealerHandHTML;
  playerHandEl.innerHTML = playerHandHTML;

  if (dealerHand.length < 2) {
    showing = ' showing'
  }
  
  updatePrompt(('Dealer has ' + dealerHand + showing + '. ' + 'You have ' + playerHand).replaceAll(',', ', '), true);
}

function playerHit() {
  updatePrompt("You hit.", true)
  playerHand.push(dealACard());
  if (!bust(playerHand)) {
    declareHands();
  } else {
    someoneBust = true;
    declareHands();
    playerLost('You bust.');
  } 
}

//Dealer hits if their hand is <= 17
function dealerHit(handArray) {
  if (handArray.length < 2) {
    dealerHand.push(dealACard())
    updatePrompt('Dealer flips over the hidden card', true);
    declareHands();
  }
  
  while (handValue(handArray) <= 17) {
    updatePrompt('Dealer takes a card.', true);
    dealerHand.push(dealACard());
    
    if (!bust(dealerHand)) {
      declareHands();
    } else {
      declareHands();
      someoneBust = true;
      document.body.style.backgroundImage = "images/winner.png";
      playerWin("Dealer bust, You win!", true)
      return;
    }
  }
  updatePrompt('Dealer stays.', true);
  evaluteWinner(playerHand, dealerHand);
}

function playerLost(msg) {
  updatePrompt(msg, true);
  document.body.style.backgroundImage = "url('images/loser.png')";
  btn1.textContent = 'Play Again';
  btn2.textContent = 'Play Again';    
}

function playerWin(msg) {
  updatePrompt(msg, true);
  document.body.style.backgroundImage = "url('images/winner.png')";
  btn1.textContent = 'Play Again';
  btn2.textContent = 'Play Again';  
}

function evaluteWinner(playerHandArray, dealerHandArray) {
  let playerHandValue = handValue(playerHandArray);
  let dealerHandValue = handValue(dealerHandArray);
  
  if (playerHandValue > dealerHandValue && (playerHandValue <= 21 && dealerHandValue <= 21)) {
    playerWin("You Win!");
    
  } else if (playerHandValue === dealerHandValue && (playerHandValue <= 21 && dealerHandValue <= 21)) {
    updatePrompt("Push", true)
    btn1.textContent = 'Play Again';
    btn2.textContent = 'Play Again';      
  }
  else {
    playerLost("You Lost.");
  }  
}


function updatePrompt(str, addToCurrent) {
  let newString = ''
  if (addToCurrent) {
    newString = promptTxt.innerHTML + '<br>' + str;
  } else {
    newString = str;
  }
  promptTxt.innerHTML = newString
}

function startNewHand(name) {
  playerHand = [];
  dealerHand = [];
  someoneBust = false;
  document.body.style.backgroundImage = "url(\"https://www.indiewire.com/wp-content/uploads/2022/04/AP765393737816.jpg\")";
  if (name != undefined && name != '') {
    updatePrompt(`Fantastic, thanks for coming, ${name}. Let's play!`, false);
  } else {
    updatePrompt(`Let's play!`, false);  
  }
  
  playerHand.push(dealACard(), dealACard());
  dealerHand.push(dealACard());
  declareHands();
  btn1.textContent = 'Hit';
  btn2.textContent = 'Stay';    
}


btn1.onclick = function() {
  if (!greetingComplete) {
    let name = namebox.value;
    namebox.remove();
    btn1.textContent = '';
    btn2.textContent = '';    
    greetingComplete = true;
    setTimeout(startNewHand(name), 2000)
    return;
  }

  if (btn1.textContent === 'Hit') {
    playerHit();
    return;
  }

  if (btn1.textContent === 'Play Again') {
    startNewHand();
    return;
  }  

}

btn2.onclick = function() {
  
  if (!greetingComplete) {
    namebox.value = ''
    return;
  }

  if (btn2.textContent === 'Play Again') {
    startNewHand();
    return;
  }  
  
  if (btn2.textContent === 'Stay') {
    dealerHit(dealerHand);
    return;
  }
  
}