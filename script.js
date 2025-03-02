
let dictionaryWords = []; // create a set for the possible inputs

// on load, load json dictionary and getting a line
window.onload = function() {
    getRandomLine();
    loadDictionary(); // loading JSON
    startTimer(); // start timer

    document.getElementById('userInput').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            checkInput();
        }
    });
};

// load the parsed json file
function loadDictionary(){ 
    fetch('parsing/dictionary_cleaned.json')
        .then(response => response.json())
        .then(data => {
            dictionaryWords = new Set(data);  // converting to set to use has()
        })
        .catch(error => console.error('Error loading dictionary:', error));

}

// getting random substrings
let randomLine = ""; // declare outside and not as const 
function getRandomLine() {
    fetch('parsing/substrings.csv')  // Updated path to 'parsing/substrings.csv'
        .then(response => { // error check
            if (!response.ok) {
                throw new Error('Network response was not ok/Failed to load file');
            }
            return response.text();
        })

        .then(data => {
            const lines = data.split('\n').filter(line => line.trim() !== ""); // remove empty lines with trim
            lines.shift(); // removes first header line 
            
            randomLine = lines[Math.floor(Math.random() * lines.length)].trim();  // random substring based on amount of rows
            console.log('Random substring:', randomLine);  // Log the random line to console for debugging
            document.getElementById('randomLine').textContent = randomLine;  // Set it in the <h2> element
        })

        .catch(error => { // error check
            console.error('Error fetching substrings:', error);
        });
}

function startGame() {
    document.getElementById('Button').style.display = "none"; // Hide start button
    document.getElementById('gameContainer').style.display = "block"; // Show game elements
    getRandomLine(); // Call function to fetch and display a random substring
}

let timeLeft = 60; // Set timer in seconds
let timerInterval;

function startTimer() {
    timerInterval = setInterval(function () {
        if (timeLeft > 0) {
            timeLeft--;
            document.getElementById('timeLeft').textContent = timeLeft; // Update timer on screen
        } else {
            clearInterval(timerInterval); // Stop timer when it reaches 0
            document.getElementById('comparisonResult').textContent = "Time's up! Game Over!";
            document.getElementById('comparisonResult').style.color = "red";
            document.getElementById('userInput').disabled = true; // Disable input field
        }

        setTimeout(function () {
            window.location.href = 'index1.html';
        }, 2000); // Redirect to index1.html after 2 seconds
    }, 1000); // Update every second
}

// checking if input is valid
function checkInput(){ 
    const userInput = document.getElementById('userInput').value.toLowerCase().trim();

    // two conditions: if it contains the short phrase, and if it is a valid word in the dictionary JSON
    const containsSubstring = userInput.includes(randomLine);
    const isValidWord = dictionaryWords.has(userInput);

    const resultElement = document.getElementById('comparisonResult'); // for readability 
    if (containsSubstring && isValidWord) {
        resultElement.textContent = "Correct!";
        resultElement.style.color = "green";

        getRandomLine(); // get a new prompt
    } else {
        resultElement.textContent = "Incorrect, try again!";
        resultElement.style.color = "red";
    }

    // reset user input text box to be empty 
    document.getElementById('userInput').value = '';

    

}

function startOver() {
    window.location.href = "index.html"; // Redirect to index.html
}



