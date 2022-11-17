// import api
const random_quote_api_url = 'https://api.quotable.io/random'
const quote_display = document.getElementById("quoteDisplay")
const quote_input = document.getElementById("quoteInput")

// init variables
let quoteSplit

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
        const characterSpan = document.createElement("span")
        characterSpan.innerText = character
        quote_display.appendChild(characterSpan)
    });
    quote_input.value = null
    console.log(quote)
}

// get user input
document.addEventListener("keydown", (e) => {
    let name = e.key;
    let code = e.code;
    let counter = 0;

    // change color to green for correct
    if (name == getNextQuote[counter]) {
        counter += 1
        let correctLetter = document.createElement("span")
        correctLetter.innerText = name
        quote_display.appendChild(correctLetter)
    }

    // change color to red for incorrect
    else if (name != getNextQuote[counter]) {
        counter += 1
        let incorrectLetter = document.createElement("span")
        incorrectLetter.innerText = name
        quote_display.appendChild(incorrectLetter)
    }

    // if return is pressed, then undo color change
    else if (name == "Backspace") {
        counter -= 1
    }

    console.log(`key pressed: ${name}, key code: ${code}`);
    console.log(counter)
})


// check user input against api string | return "correct" or "incorrect" comparing user's input

// add WPM counter, add a value that goes up by one evert time the correct key is pressed and divide the total by 60

getNextQuote()