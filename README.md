# Typing Gym
For anybody who wants to improve their typing skills without the ad bloat! Typing Gym helps them improve their WPM and speed while typing. I made this project because I was fed up with the ads and cookies on popular typing tests.
This was also a great way for me to practice JavaScript and apply some of the knowledge I've gained these last few weeks while using flask, bootstrap, and apis.

# How it works
On pageload, my script grabs a randomly generated quote from https://api.quotable.io and splits the string up into individual spans.

``` javascript
const random_quote_api_url = 'https://api.quotable.io/random'

// fetches quote from api
async function getQuote() {
    return await fetch(random_quote_api_url)
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
    })
    characterSpanArray[0].classList.add("firstBlinking") 
    console.log(quote)
}
```

When the user types, the script will assign either a "correct" or "incorrect" class name onto the proper span element in the array. These two tags mostly just handle the
styling, but the scoring is also handled next to the class reassignment inside of the event listener's conditionals.

``` javascript
document.addEventListener("keydown", (e) => {
    let keyStroke = e.key
    let code = e.code
    let character = quoteSplit[counter]

    if (allowTyping === true) {
        if (isTimerStarted === true) {
            timerInterval = setInterval(timer, 1000)
            isTimerStarted = false
        }

        if (keyStroke === character.toLowerCase()) {       
            characterSpanArray[counter].classList.add("correct")
            blinkyThing()
            counter += 1
            totalCounter += 1
        }

        else if (keyStroke === "Backspace" && counter > 0) {
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

        else if (keyStroke != character.toLowerCase() && isAlpha(keyStroke) === true) {
            characterSpanArray[counter].classList.add("incorrect")
            blinkyThing()
            counter += 1
            totalCounter += 1
            mistakesCounter += 1
        }
```

# What I've learned
Although this project seems pretty straightforard, there were a bunch of issues early in development. Firstly, there was no "isAlpha" function in JavaScript so I had to
make my own: 

``` javascript 
const isAlpha = function(ch) {
    return typeof ch === "string" && ch.length === 1 && (ch >= "a" && ch <= "z" || ch >= "A" && ch <= "Z");
}
```

Also, one of the biggest hurdles was the blinking cursor logic which signaled the user where their cursor was positioned. I ended up doing something similar to the
"correct" and "incorrect" class names and assigning the correct span index with a "blinking" tag which had some keyframes and border styling attatched to it. When the user would type or the timer hits zero, a function would erase all "blinking" class tags from all span elements
then reassign the correct span with "blinking". This was especially tricky when the user would hit "backspace" so we had to add an argument which would inverse the array position selector to hit the span before the current index.
Huge props to these amazing folks who helped me out with this: <br> <br>
https://github.com/alexcrocha <br>
https://github.com/Babaganouche622 <br>
https://github.com/EvilGenius13

