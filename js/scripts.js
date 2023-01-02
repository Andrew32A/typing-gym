// import api
const random_quote_api_url = 'https://api.quotable.io/random'

// grabs element id's and assigns them to a variable
const quoteDisplay = document.getElementById("quoteDisplay")
const timeDisplay = document.getElementById("timeDisplay")
const wpmDisplay = document.getElementById("wpmDisplay")
const mistakesDisplay = document.getElementById("mistakesDisplay")
const resultsDisplay = document.getElementById("results")
const accuracyDisplay = document.getElementById("accuracyDisplay")
const charactersDisplay = document.getElementById("charactersDisplay")

const menuParent = document.querySelector(".menuParent")
const itemArray = document.querySelectorAll(".item") // item is an array when getting it by query selector all

// init variables
// const fs = require('fs')
let quoteSplit // contains array for quote that i later reassign to character
let characterSpanArray = [] // array created from quoteSplit that stores the spans
let counter = 0 // stores keys hit per quote
let totalCounter = 0 // stores total counter per session
let mistakesCounter = 0
let characterSpan = document.createElement("span")
let isTimerStarted = true
let timerInterval // allows interval to be seen by other functions
let allowTyping = true
let offlineIndex // random quote from offline json index

let timeTotal = 30
let timeLeft = 30
let menuCounter = 0

// grabs quote from json incase the api is offline
function offlineQuotes() {
    offlineIndex = Math.floor(Math.random() * 2000)
    console.log(offlineIndex)

    return fetch('./data.json')
    .then(response => {
        return response.json()
    })
    .then(data => {
        return data[offlineIndex].content
    })
    .catch(error => console.log(error));
}

// fetches quote from api, huge props to https://github.com/jennifercarreno for helping me w/ .catch and new Error
function getQuote() {
    return fetch(random_quote_api_url)
    .then((response) => {
        console.log(response)
        if (response.ok) {
            return response.json()
        }
        else {
            throw new Error('Something went wrong with api, swapping to offline quotes')
        }
    })
    
    .then((data) => {
        console.log(data)
        return data.content
    })

    .catch((error) => {
        console.log(error)
        return offlineQuotes()
    })
}

// recieves quote from getQuote, splits it into an array, and displays each in its own span tag
async function getNextQuote() {
    const quote = await getQuote()
    quoteDisplay.innerText = ""
    quoteSplit = quote.split("")
    quoteSplit.forEach(character => {
        characterSpan = document.createElement("span")
        characterSpanArray.push(characterSpan)
        characterSpan.innerText = character.toLowerCase()
        quoteDisplay.appendChild(characterSpan)
    })
    characterSpanArray[0].classList.add("firstBlinking") 
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

// after mistakes were tallied, adds to innerText
function mistakes() {
    mistakesDisplay.innerText = mistakesCounter
}

// after characters were tallied, adds to innerHTML
function charactersCounter() {
    charactersDisplay.innerHTML = totalCounter
}

// timer
function timer() {
    if (timeLeft > 0) {
        timeLeft -= 1
        timeDisplay.innerText = timeLeft
        wpmCounter() // had to put wpm counter in here to prevent input from refreshing constantly
        accuracyCalculator() // same as wpm counter
    }

    else {
        resetLoopChecker()
    }
}

// calculates wpm by dividing the number of characters typed by 5 (standard for calculating size of words) then divided again by elapsed time in minutes
function wpmCounter() {
    let wpm = Math.round((totalCounter / 5) / (((timeLeft - 30) * (-1) / 60)))
    wpmDisplay.innerHTML = wpm
}

// calculates accuracy which is displayed in the results
function accuracyCalculator() {
    let accuracy = Math.round((((mistakesCounter / totalCounter) * 100) - 100) * -1)
    accuracyDisplay.innerHTML = `${accuracy}%`
}

// checks if we need to reset session
function resetLoopChecker() {
    mistakes()
    charactersCounter()
    completedChecker()

    // when timer hits 0, pause everything and display results
    if (timeLeft === 0) {
        allowTyping = false
        clearInterval(timerInterval)
        displayResults()

        // removes blinking to signal the user that the session is done
        characterSpanArray.forEach((span) => {
            // span.style.borderRight = "0px"
            // span.style.borderLeft = "0px"
            span.classList.remove("blinking")
            span.classList.remove("firstBlinking")
        })
    }
}

// displays results once timer hits 0 || changes colors of wpm and mistakes too
function displayResults() {
    wpmDisplay.classList.add("wpmResults") // adds blue color to wpm display
    timeDisplay.innerText = ("Time's up! Hit the button below to try again") // replaces time display with text
    
    if (mistakesCounter > 0) {
        mistakesDisplay.classList.add("mistakesResultsRed") // adds red color to mistakes display
    }
    
    else {
        mistakesDisplay.classList.add("mistakesResultsPerfect") // adds blue color to mistakes display
    }
    
    resultsDisplay.classList.remove("resultsHidden") // removes the css that hides results
    resultsDisplay.classList.add("resultsDisplay") // adds css which show results

    // leaderboard for future me to finish
    // fs.writeFile("leaderboard.txt", wpmCounter, (err) => {
    //     if (err)
    //       console.log(err);
    //     else {
    //       console.log("File written successfully\n");
    //       console.log("The written has the following contents:");
    //       console.log(fs.readFileSync("leaderboard.txt", "utf8"));
    //     }
    //   });
}

// handles blinker logic, if the user tries to delete from index 1 to index 0 or tries to backspace from index 0, the script will check for a TypeError and replace index 0 with a left border blink
function blinkyThing(counterPositionModifier = 0) {
    try {
        characterSpanArray.forEach((span) => {
            // span.style.borderRight = "0px"
            // span.style.borderLeft = "0px"
            span.classList.remove("blinking")
            span.classList.remove("firstBlinking")
        })
        // characterSpanArray[counter + numberCounter].style.borderRight = "1px solid #ccccb5"
        characterSpanArray[counter + counterPositionModifier].classList.add("blinking") 
    }

    catch (err) {
        if (err instanceof TypeError) {
            characterSpanArray.forEach((span) => {
                span.classList.remove("blinking")
                span.classList.remove("firstBlinking")
        })
        characterSpanArray[0].classList.add("firstBlinking") 
        }
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
    wpmDisplay.classList.remove("wpmResults") // removes color when session is reset   
    mistakesDisplay.classList.remove("mistakesResultsRed") // removes color when session is reset
    mistakesDisplay.classList.remove("mistakesResultsPerfect") // removes color when session is reset
    resultsDisplay.classList.remove("resultsDisplay") // removes display properties
    resultsDisplay.classList.add("resultsHidden") // adds hidden properties which hide the element
    wpmDisplay.innerHTML = "--" // removes last wpm display to avoid confusion for the user
    allowTyping = true
    mistakes() // may need to move this later, put this here to reset mistakes display counter right away
}

// main loop which also grabs get user input
document.addEventListener("keydown", (e) => {
    let keyStroke = e.key
    let code = e.code
    let character = quoteSplit[counter]

    if (allowTyping === true) {
        if (isTimerStarted === true) {
            timerInterval = setInterval(timer, 1000)
            isTimerStarted = false
        }

        // change color to green for correct
        if (keyStroke === character.toLowerCase()) {       
            // adds "correct" class to span in index with correct key press
            characterSpanArray[counter].classList.add("correct")
            blinkyThing()
            counter += 1
            totalCounter += 1
        }

        // if return is pressed, then removes "incorrect" and "correct" classes and undo color change
        else if (keyStroke === "Backspace" && counter > 0) {
            // checks if previous index contains "incorrect" inside of it's class, if so, it runs the same as the else statement and removes 1 from the mistakes counter
            if (characterSpanArray[counter - 1].classList.contains("incorrect")) {
                characterSpanArray[counter - 1].classList.remove("incorrect")
                characterSpanArray[counter - 1].classList.remove("correct")
                counter -= 1
                totalCounter -= 1
                mistakesCounter -= 1  
                blinkyThing(-1)
            }

            else {
                counter -= 1
                totalCounter -= 1
                characterSpanArray[counter].classList.remove("correct")   
                blinkyThing(-1)
            } 
        }

        // change color to red for incorrect
        else if (keyStroke != character.toLowerCase() && isAlpha(keyStroke) === true || code === "Space") {
            // adds "incorrect" class to span in index with incorrect key press
            characterSpanArray[counter].classList.add("incorrect")
            blinkyThing()
            counter += 1
            totalCounter += 1
            mistakesCounter += 1
        }

        // console log area set to true or false
        if (true === true) {
            console.log(`key pressed: ${keyStroke}, key code: ${code}`)
            console.log(counter)
            console.log(character)
            console.log(characterSpanArray[counter])
        }

    // calls functions created above
    // contains completed checker and handles mistakes push to innerHTML 
    resetLoopChecker()
    }
})

// starts loop
getNextQuote()

// *********************************************************************
// code for timer menu and behavior

// helper function to calculate width based on num of items
function widthCalculator() {
    // takes length of array, adds 1 for menuParent, then times it by 73px which was from the original value (365px / 5)
    let width = `${((itemArray.length + 1) * 73)}px`
    return width
}

// opens menu
function openMenu() {
    anime({
        targets: "#menu",
        backgroundColor: "#151a21",
        width: widthCalculator(),
        easing: "easeInOutQuad"
    })

    for (let i = 0; i < itemArray.length; i++) {
        anime ({
            targets: itemArray[i],
            translateX: (60 * (i + 1)),
            opacity: 2,
            easing: "easeInOutQuad"
            // i really wanted to use stagger to handle each item element, but it's only available on the latest version of anime.js which i couldn't get to work right now
            // instead, i used a for loop to handle each element
            // delay: anime.stagger(100)
        })

        itemArray[i].style.visibility = "visible"
    }
}

// closes menu
function closeMenu() {
    anime({
        targets: "#menu",
        backgroundColor: "#1b2028",
        width: "125px",
        easing: "easeOutQuint"
    })

    for (let i = 0; i < itemArray.length; i++) {
        anime ({
            targets: itemArray[i],
            translateX: 0,
            opacity: -2 // had to set opacity to -2 to avoid weird stutter from bounceback effect in anime.js
        })

        itemArray[i].style.visibility = "hidden"
    }
}

// counts the num of times the user clicked on menu and handles menu behaviour as needed
function menuToggle() {
    menuCounter++
    if (menuCounter % 2 === 0) {
        closeMenu()
    }
    else {
        openMenu()
    }
}

// activates menu functionality, remove this to disable menu
menuParent.addEventListener("click", menuToggle)

// changes menu parent value depending on which item was clicked
function menuChange(item) {
    console.log(item)
    for (i = 0; i < itemArray.length; i++) {
        if (item.id === itemArray[i].id) {
            menuParent.innerHTML = itemArray[i].innerHTML
        }
    }
    
    menuCounter++
    closeMenu()
}