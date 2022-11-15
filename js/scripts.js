// import api
const random_quote_api_url = 'http://api.quotable.io/random'
const quote_display = document.getElementById("quoteDisplay")
const quote_input = document.getElementById("quoteInput")

function get_quote(){
    return fetch(random_quote_api_url)
        .then(response => response.json())
        .then(data => data.content)
}

async function get_next_quote(){
    const quote = await get_quote()
    quote_display.innerText = quote
    console.log(quote)
}

get_next_quote()

// check user input


// return "correct" or "incorrect" comparing user's input

// add WPM counter, add a value that goes up by one evert time the correct key is pressed and divide the total by 60