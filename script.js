let korTown = ["Seoul", "Busan", "Incheon", "Daegu", "Daejeon", "Gwangju",
  "Suwon", "Ulsan", "Changwon", "Goyang", "Yongin", "Seongnam", "Bucheon",
  "Jeonju", "Cheongju", "Anyang", "Namyangju", "Jeju", "Pohang", "Gimhae"];

//Variables that determine the display (instructions, welcome messages, the cities, etc)
let greetings=document.querySelector(".welcome-message");
let cityDashes=document.getElementById("cityGuess");
const letterButtons = document.getElementById("letterButtons");
const letterDisplay = document.getElementById("letterDisplay");
let successfulResponse = document.querySelector(".successful__response");
let instructions = document.querySelector(".instructions");

//Variables to start and restart the game
const playingButton = document.getElementById("playButton");
const replayingButton = document.getElementById("replayButton"); 
 
let currentAttempt = 0;
const MAX_ATTEMPTS = 6;
let attempts=0;
let correctGuesses=0; 

let cityResult="";
let rightCity=0;
let hiddenCity=[]; 
let dashCount=0;
let guessedLetters=[]; 

//styling
const COL_OPACITY= 0.65; 

//hangman's body parts
const hangmanHead = document.getElementById("hangmanHead");
const hangmanWaist = document.getElementById("hangmanWaist"); 
const hangmanRightArm = document.getElementById("hangmanRightArm"); 
const hangmanLeftArm = document.getElementById("hangmanLeftArm"); 
const hangmanRightLeg=document.getElementById("hangmanRightLeg");
const hangmanLeftLeg=document.getElementById("hangmanLeftLeg");

function getRandomWords(inputArray){
  let randomChoice=Math.floor(Math.random()*inputArray.length);
  console.log (inputArray[randomChoice]);

  return inputArray[randomChoice];
 
}
//Start the game
playingButton.addEventListener("click", startGame);

//Restart the game 
replayingButton.addEventListener("click", function (){
  window.location.reload();
}); 

//Must be in the document
document.addEventListener("keydown", function hangmanTyping(event) {
    //Latin letters in the keyboard only
    let pressedLetter=event.key.toLowerCase();
    
    if(!pressedLetter.match(/[a-z]/)){
      return;
    }

    //let correspKeys=[...letterButtons.querySelectorAll("button")].find(p=>p.textContent.toLowerCase()==pressedLetter);
    
    //gatherButtons are node lists (array like object)
    let gatherButtons=document.querySelectorAll("button"); 

    //act as an array to keep all buttons
    let allButtonsArray= Array.from(gatherButtons)
    let correspKeys=allButtonsArray.find(p=>p.textContent.toLowerCase()==pressedLetter);

    
    if(correspKeys){
      correspKeys.click();
    }

});

  //You may be able to add a condition to stop accepting keyboard listener
  if (attempts >= MAX_ATTEMPTS && dashCount===0){
      document.removeEventListener();
    }
function startGame() 
{
attempts=0;
guessedLetters=[];
correctGuesses=0;
//greetings.style.display="block";
greetings.classList.add("element__erase");
playingButton.classList.add("element__erase");

//keeps the random result 
cityResult=getRandomWords(korTown);

//If the city has been selected, it will be pulled out of the array
const cityTakenOut = korTown.indexOf(cityResult);

if(cityTakenOut>-1){
korTown.splice(cityTakenOut, 1);
}

console.log(korTown);

//split() takes a string and returns an array
let breakcityResult=cityResult.split('');
let underScore="_ ";

//map() takes an array and converts to an array of  ["_ ", "_ ", "_ ", "_ ", "_ "]
hiddenCity = breakcityResult.map(() => underScore);
cityDashes.innerText = hiddenCity.join("");

//cityDashes.innerText=finalHiddenCity;//aside was gone because of innerHTML
createLetterButtons();
}

//createLetterButtons();
  function createLetterButtons() {
    // Clear any existing buttons
    letterButtons.textContent = ''; 

    
    // Create buttons for each letter from a-z
    let letters = "abcdefghijklmnopqrstuvwxyz";
    for (let alph of letters) {
        let oneButton = document.createElement("button");
        oneButton.textContent = alph.toUpperCase();  // Display letter as uppercase

        // Add click event listener to handle guesses
        oneButton.addEventListener("click", function () {
            handleGuess(alph, oneButton);  // Pass the letter and button to handleGuess
            countDash();
        });

        // Append button to the letter buttons container
        letterButtons.appendChild(oneButton);
        
    }

  }

function countDash(){
 dashCount = cityDashes.textContent.split("_ ").length - 1;
}

function handleGuess(letter, button) {
    // Update the UI based on the guessed letter here
    //letterDisplay.innerText+=letter;

  if(guessedLetters.includes(letter)){
    return;
  }
  //Attempted letters list
  guessedLetters.push(letter);

  //Checks if the letter exists in the name of the city 
  //initialising the guess will be updated to true if it matches the city name (checked through the loop)
  let correctGuess=false;
  let choppedHiddenCity=hiddenCity.slice();

  for(let counter = 0; counter < cityResult.length; counter++){

    if(cityResult[counter].toLowerCase() === letter.toLowerCase()){

      //Replaces the underscore if the user inserts the relevant letter.
      choppedHiddenCity[counter] = letter;
      correctGuess=true;
    }
  }

  // Update the hidden city UI with the new letters
  hiddenCity = choppedHiddenCity;
  cityDashes.innerText = hiddenCity.join('');  // Display the updated hidden city

  if(correctGuess){
    correctGuesses++;

    //The button that we pressed turns purple
    button.classList.add("display__purple");
    button.style.opacity=COL_OPACITY;

  }
  else {
    attempts++;
    hangTheGuy();
  } 
    
    letterDisplay.innerText = "Wrong attempt "+ attempts+" out of 6";

    countDash();

    if(attempts < MAX_ATTEMPTS && dashCount===0){
      letterDisplay.innerText= "Well done! round "+ rightCity +"successful. Answer: "+ cityResult;
      
      successfulResponse.innerText+=cityResult+ "\u000A";

      rightCity++;
      letterDisplay.innerText="Round "+Math.ceil(parseInt("1")+rightCity);
      startGame();
      unhangTheGuy();

      if(rightCity===5){
        endGame();
        instructions.innerText="Five wins! Thank you for playing. Please refresh your browser to start again.";
        letterDisplay.classList.add("element__erase"); 
      }
    }
    if (attempts >= MAX_ATTEMPTS){
      instructions.innerText= "You lost! Answer: "+ cityResult+ ".";
      endGame();
      replayingButton.classList.remove("element__erase");
      
    }
    button.disabled=true;       
}

function hangTheGuy(){
  if(attempts===1){
   hangmanHead.classList.remove("hangman__body--hidden"); 
  }
  if(attempts===2){
    hangmanWaist.classList.remove("hangman__body--hidden");
  }
  if(attempts==3){
   hangmanRightArm.classList.remove("hangman__body--hidden");
  }
  if(attempts==4){
   hangmanLeftArm.classList.remove("hangman__body--hidden");
  }
  if(attempts==5){
   hangmanRightLeg.classList.remove("hangman__body--hidden");
  }
  if(attempts==6){
   hangmanLeftLeg.classList.remove("hangman__body--hidden");
  }

}
function unhangTheGuy(){
hangmanHead.classList.add("hangman__body--hidden"); 
hangmanWaist.classList.add("hangman__body--hidden");
hangmanRightArm.classList.add("hangman__body--hidden");
hangmanLeftArm.classList.add("hangman__body--hidden");
hangmanRightLeg.classList.add("hangman__body--hidden");
hangmanLeftLeg.classList.add("hangman__body--hidden");
}

function endGame(){
letterButtons.classList.add("element__erase"); 
cityDashes.classList.add("element__erase"); 
playingButton.classList.add("element__erase"); 
}

