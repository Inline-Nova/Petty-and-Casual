let dictionaryWords = []; // create a set for the possible inputs
let substringsSolved = parseInt(localStorage.getItem('substringsSolved')) || 0;; // create a counter for the number of substrings solved

// on load, load json dictionary and getting a line
window.onload = function() {
    console.log(document.getElementById('userInput')); // Check if element exists
    console.log(document.getElementById('randomLine')); // Check if element exists
    console.log(document.getElementById('timeLeft')); // Check if element exists
    console.log(document.getElementById('comparisonResult')); // Check if element exists
    
    // getRandomLine();
    loadDictionary(); // loading JSON

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
            const randomLineElement = document.getElementById('randomLine');
            if (randomLineElement) {
                randomLineElement.textContent = randomLine;  // Set it in the <h2> element
            } else {
                console.log("Element 'randomLine' not found. This might be index1.html.");
            }
        })

        .catch(error => { // error check
            console.error('Error fetching substrings:', error);
        });
}

function startGame() {
    document.getElementById('Button').style.display = "none"; // Hide start button
    document.getElementById('gameContainer').style.display = "block"; // Show game elements
    getRandomLine(); // Call function to fetch and display a random substring
    startTimer(); // start timer
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

            localStorage.setItem('substringsSolved', substringsSolved); // Save number of substrings solved to local storage
            console.log('Final substringsSolved (Time\'s Up):', substringsSolved);

            setTimeout(function () {
                window.location.href = 'index1.html';
            }, 2000); // Redirect to index1.html after 2 seconds
        }

    }, 1000); // Update every second
}

// checking if input is valid
function checkInput(){ 
    const userInput = document.getElementById('userInput').value.toLowerCase().trim();

    // two conditions: if it contains the short phrase, and if it is a valid word in the dictionary JSON
    const containsSubstring = userInput.includes(randomLine);
    const isValidWord = dictionaryWords.has(userInput);

    const resultElement = document.getElementById('comparisonResult'); // for readability 

    console.log('User Input:', userInput);
    console.log('Contains Substring:', containsSubstring);
    console.log('Is Valid Word:', isValidWord);

    if (containsSubstring && isValidWord) {
        
        substringsSolved++;
        console.log('Substrings Solved (before update):', substringsSolved);
        localStorage.setItem('substringsSolved', substringsSolved); // Store updated count
        displaySolvedCount();
        
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

function displaySolvedCount() {
    const solvedCountElement = document.getElementById('solvedCount');
    if (solvedCountElement) {
        console.log('Displaying Solved Count:', substringsSolved);
        solvedCountElement.textContent = substringsSolved;
    }
}




