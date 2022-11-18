// import api
const random_quote_api_url = 'https://api.quotable.io/random'
const quote_display = document.getElementById("quoteDisplay")
const quote_input = document.getElementById("quoteInput")

// init variables
let quoteSplit // contains array for quote
let counter = 0;
let characterSpan = document.createElement("span")
let characterSpanArray = []

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
        characterSpan.innerText = character
        quote_display.appendChild(characterSpan)
    });
    quote_input.value = null
    console.log(quote)
}


// get user input
document.addEventListener("keydown", (e) => {
    let keyStroke = e.key;
    let code = e.code;
    let character = quoteSplit[counter]
    // let characters = quote_display.querySelectorAll("span")

    // change color to green for correct
    if (keyStroke === character) {
        console.log(`key pressed: ${keyStroke}, key code: ${code}`);
        console.log(counter)
        console.log(character)
        // let correctLetter = document.createElement("span")
        // correctLetter.innerText = keyStroke
        // quote_display.appendChild(correctLetter)
        
        // adds "correct" class to span in index with correct key press
        // character.classList.add = ("correct")
        characterSpanArray[counter].classList.add("correct");
        counter += 1
    }

    // change color to red for incorrect
    else if (keyStroke != quoteSplit[counter]) {
        let incorrectLetter = document.createElement("span")
        incorrectLetter.innerText = keyStroke
        quote_display.appendChild(incorrectLetter)
        
        // adds "incorrect" class to span in index with incorrect key press
        characterSpanArray[counter].classList.add("incorrect");    
        counter += 1
    }

    // if return is pressed, then undo color change
    else if (keyStroke === "Backspace") {
        counter -= 1
        
        // removes "incorrect" and "correct" class from span in index when user inputs "Backspace"
        characterSpanArray.classList.remove("correct");    
        characterSpanArray.classList.remove("incorrect");   
    }

    console.log(`key pressed: ${keyStroke}, key code: ${code}`);
    console.log(counter)

    // console.log(characters[0])
    // console.log(quote_display[0])
    // console.log(getNextQuote[0])
    console.log(character)
})


// check user input against api string | return "correct" or "incorrect" comparing user's input

// add WPM counter, add a value that goes up by one evert time the correct key is pressed and divide the total by 60

getNextQuote()