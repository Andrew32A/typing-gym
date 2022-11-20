// import api
const random_quote_api_url = 'https://api.quotable.io/random'

// grabs element id's and assigns them to a variable
const quoteDisplay = document.getElementById("quoteDisplay")
const timeDisplay = document.getElementById("timeDisplay")
const wpmDisplay = document.getElementById("wpmDisplay")
const mistakesDisplay = document.getElementById("mistakesDisplay")

// init variables
let quoteSplit // contains array for quote that i later reassign to character
let characterSpanArray = [] // array created from quoteSplit that stores the spans
let counter = 0 // stores keys hit per quote
let totalCounter = 0 // stores total counter per session
let mistakesCounter = 0
let characterSpan = document.createElement("span")
let timeLeft = 30
let isTimerStarted = true
let timerInterval // allows interval to be seen by other functions
let allowTyping = true

// fetches quote from api
function getQuote() {
    return fetch(random_quote_api_url)
        .then(response => response.json())
        .then(data => data.content)
}

// recieves quote from getQuote, splits it into an array, and displays each in it's own span tag
async function getNextQuote() {
    const quote = await getQuote()
    quoteDisplay.innerText = ""
    quoteSplit = quote.split("")
    quoteSplit.forEach(character => {
        characterSpan = document.createElement("span")
        characterSpanArray.push(characterSpan)
        characterSpan.innerText = character.toLowerCase()
        quoteDisplay.appendChild(characterSpan)
    });
    console.log(quote)
}

// couldn't find an equivalent to isAlpha so i snagged this off of stackoverflow
const isAlpha = function(ch) {
    return typeof ch === "string" && ch.length === 1 && (ch >= "a" && ch <= "z" || ch >= "A" && ch <= "Z");
}

// checks if user completed prompt
function completedChecker() {
    if (counter === characterSpanArray.length) {
        counter = 0
        characterSpanArray = [] // resets array for character spans
        getNextQuote()
    }
}

// tallies mistakes and adds to innerText
function mistakes() {
    mistakesDisplay.innerText = mistakesCounter
}

// timer
function timer() {
    if (timeLeft > 0) {
        timeLeft -= 1
        timeDisplay.innerText = timeLeft
        wpmCounter() // had to put wpm counter in here to prevent input from refreshing constantly
    }
}

// calculates wpm by dividing the number of characters typed by 5 (standard for calculating size of words) then divided again by elapsed time in minutes
function wpmCounter() {
    let wpm = Math.round((totalCounter / 5) / (((timeLeft - 30) * (-1) / 60)))
    wpmDisplay.innerHTML = wpm
}

// checks if we need to reset session
function resetLoopChecker() {
    mistakes()
    completedChecker()

    // when timer hits 0, pause everything and display results
    if (timeLeft === 0) {
        allowTyping = false
        clearInterval(timerInterval)
    }

    // if typing was disabled and timer is 0, reset loop entirely
    if (allowTyping === false) {
        document.addEventListener("keydown", (e) => {
            if (timeLeft === 0) {
                resetLoop()
            }
            // else {resetLoop()}
        })
    }
}

// resets session
function resetLoop() {
    clearInterval(timerInterval)
    isTimerStarted = true
    characterSpanArray = []
    getNextQuote()
    timeLeft = 30
    timeDisplay.innerText = timeLeft
    counter = 0
    totalCounter = 0
    mistakesCounter = 0
    allowTyping = true
    mistakes() // may need to move this later, put this here to reset mistakes display counter right away
}

// get user input
document.addEventListener("keydown", (e) => {
    let keyStroke = e.key;
    let code = e.code;
    let character = quoteSplit[counter]

    if (allowTyping === true) {

        if (isTimerStarted === true) {
            timerInterval = setInterval(timer, 1000)
            isTimerStarted = false
        }

        // change color to green for correct
        if (keyStroke === character.toLowerCase()) {       
            // adds "correct" class to span in index with correct key press
            characterSpanArray[counter].classList.add("correct");
            counter += 1
            totalCounter += 1
        }

        // if return is pressed, then removes "incorrect" and "correct" classes and undo color change
        else if (keyStroke === "Backspace" && counter > 0) {
            // checks if previous index contains "incorrect" inside of it's class, if so, it runs the same as the else statement and removes 1 from the mistakes counter
            if (characterSpanArray[counter - 1].classList.contains("incorrect")) {
                characterSpanArray[counter - 1].classList.remove("incorrect");
                characterSpanArray[counter - 1].classList.remove("correct");
                console.log("it did something")
                counter -= 1
                totalCounter -= 1
                mistakesCounter -= 1  
            }

            else {
                counter -= 1
                totalCounter -= 1
                characterSpanArray[counter].classList.remove("correct");    
            } 
        }

        // change color to red for incorrect
        else if (keyStroke != character.toLowerCase() && isAlpha(keyStroke) === true) {
            // adds "incorrect" class to span in index with incorrect key press
            characterSpanArray[counter].classList.add("incorrect");    
            counter += 1
            totalCounter += 1
            mistakesCounter += 1
        }

        // console log area set to true or false
        if (true) {
            console.log(`key pressed: ${keyStroke}, key code: ${code}`);
            console.log(counter)
            console.log(character)
            console.log(characterSpanArray[counter])

        // calls functions created above
        resetLoopChecker() // contains completed checker and handles mistakes push to innerHTML
        }
    }
})

// starts loop
getNextQuote()