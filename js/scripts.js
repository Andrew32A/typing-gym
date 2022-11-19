// import api
const random_quote_api_url = 'https://api.quotable.io/random'
const quote_display = document.getElementById("quoteDisplay")
const quote_input = document.getElementById("quoteInput")

// init variables
let quoteSplit // contains array for quote that i later reassign to character
let characterSpanArray = [] // array created from quoteSplit that stores the spans
let counter = 0;
let characterSpan = document.createElement("span")

// fetches quote from api
function getQuote() {
    return fetch(random_quote_api_url)
        .then(response => response.json())
        .then(data => data.content)
}

// recieves quote from getQuote, splits it into an array, and displays each in it's own span tag
async function getNextQuote() {
    const quote = await getQuote()
    quote_display.innerText = ""
    quoteSplit = quote.split("")
    quoteSplit.forEach(character => {
        characterSpan = document.createElement("span")
        characterSpanArray.push(characterSpan)
        characterSpan.innerText = character.toLowerCase()
        quote_display.appendChild(characterSpan)
    });
    quote_input.value = null
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

// get user input
document.addEventListener("keydown", (e) => {
    let keyStroke = e.key;
    let code = e.code;
    let character = quoteSplit[counter]

    // change color to green for correct
    if (keyStroke === character.toLowerCase()) {       
        // adds "correct" class to span in index with correct key press
        characterSpanArray[counter].classList.add("correct");
        counter += 1
    }

    // if return is pressed, then undo color change
    else if (keyStroke === "Backspace" && counter >= 1) {
        counter -= 1
        
        // removes "incorrect" and "correct" class from span in index when user inputs "Backspace"
        characterSpanArray[counter].classList.remove("correct");    
        characterSpanArray[counter].classList.remove("incorrect");   
    }

    // change color to red for incorrect
    else if (keyStroke != character.toLowerCase() && isAlpha(keyStroke) === true) {
        // adds "incorrect" class to span in index with incorrect key press
        characterSpanArray[counter].classList.add("incorrect");    
        counter += 1
    }

    
    // console log area
    console.log(`key pressed: ${keyStroke}, key code: ${code}`);
    console.log(counter)
    // console.log(characters[0])
    // console.log(quote_display[0])
    // console.log(getNextQuote[0])
    console.log(character)
    completedChecker()
})

// add WPM counter, add a value that goes up by one evert time the correct key is pressed and divide the total by 60

getNextQuote()