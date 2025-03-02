// let rows = [];
// let currentIndex = 0;
// const batchSize = 100;

// document.getElementById('csvFile').onchange = function (e){
//     const file = e.target.files[0];
//     Papa.parse(file,{

//     })
// }

window.onload = function() {
    getRandomLine();

    let correctWord = "";

    fetch('parsing/dictionary_cleaned.csv')  // Updated path to 'parsing/dictionary.csv'
        .then(response => response.text())
        .then(data => {
            const lines = data.split('\n');  // Split content by line breaks
            correctWord = lines[Math.floor(Math.random() * lines.length)].trim();  // Get random valid word
        })
        .catch(error => console.error('Error fetching file:', error));

    document.getElementById('userInput').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            const userInput = document.getElementById('userInput').value;

            // Compare the user input with the predefined correct word
            if (userInput.toLowerCase() === correctWord.toLowerCase()) {
                document.getElementById('comparisonResult').textContent = "Correct!";
                document.getElementById('comparisonResult').style.color = "green";
            } else {
                document.getElementById('comparisonResult').textContent = "Incorrect, try again!";
                document.getElementById('comparisonResult').style.color = "red";
            }

            // Clear the input field after the Enter key is pressed
            document.getElementById('userInput').value = '';
        }
    });
};

function getRandomLine() {
    fetch('parsing/substrings.csv')  // Updated path to 'parsing/substrings.csv'
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            const lines = data.split('\n');
            // const firstTenLines = lines.slice(0, 10);
            const randomLine = lines[Math.floor(Math.random() * data.length)].trim();  // Get random substring
            console.log('Random substring:', randomLine);  // Log the random line to console for debugging
            document.getElementById('randomLine').textContent = randomLine;  // Set it in the <h2> element
        })
        .catch(error => {
            console.error('Error fetching file:', error);
        });
}

