// import api
const random_quote_api_url = 'https://api.quotable.io/random'
const quote_display = document.getElementById("quoteDisplay")
const quote_input = document.getElementById("quoteInput")

function get_quote() {
    return fetch(random_quote_api_url)
        .then(response => response.json())
        .then(data => data.content)
}

async function get_next_quote(){
    const quote = await get_quote()
    quote_display.innerText = quote
    quote.split("")
    // quote_input.value = null
    console.log(quote)
}

get_next_quote()

// get user input
document.addEventListener("keydown", (e) => {
    let name = e.key;
    let code = e.code;

    console.log(`key pressed: ${name}, key code: ${code}`);
})


// check user input against api string | return "correct" or "incorrect" comparing user's input

// add WPM counter, add a value that goes up by one evert time the correct key is pressed and divide the total by 60