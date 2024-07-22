// Function to generate a poem based on user input theme
function generatePoem(event) {
    event.preventDefault(); // Prevent form submission from reloading the page

    const theme = document.getElementById("title").value.toLowerCase().trim();
    const filename = theme + ".txt"; // Assuming files are named like "love.txt", "nature.txt", etc.

    fetch(filename)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            const lines = data.trim().split("\n");
            const poems = [];
            let currentPoemNumber = '';
            let currentPoemLines = [];

            // Parse the lines into individual poems
            lines.forEach(line => {
                if (line.trim() === '') {
                    return; // Skip empty lines
                }
                // Check if line starts with a number followed by a dot (e.g., "98.", "99.")
                const match = line.match(/^(\d+)\.\s*(.*)$/);
                if (match) {
                    if (currentPoemNumber !== '') {
                        poems.push({ number: currentPoemNumber, lines: currentPoemLines });
                    }
                    currentPoemNumber = match[1];
                    currentPoemLines = [match[2].trim()];
                } else {
                    currentPoemLines.push(line.trim());
                }
            });

            // Push the last poem into poems array
            if (currentPoemNumber !== '') {
                poems.push({ number: currentPoemNumber, lines: currentPoemLines });
            }

            // Select a random poem
            const randomIndex = Math.floor(Math.random() * poems.length);
            const selectedPoem = poems[randomIndex];

            // Display the poem
            const poemHTML = selectedPoem.lines.map(line => `<div>${line}</div>`).join("");
            document.getElementById("poem-container").innerHTML = poemHTML;

            // Start text animation
            animateText(selectedPoem.lines);
        })
        .catch(error => {
            console.error('Error fetching and parsing data:', error);
            document.getElementById("poem-container").innerHTML = "<div>Failed to generate poem. Please try again.</div>";
        });
}



function animateText(lines, index = 0) {
    const poemContainer = document.getElementById("poem-container");

    // Clear existing content if this is the first line being animated
    if (index === 0) {
        poemContainer.innerHTML = "";
    }

    if (index >= lines.length) {
        return; // Exit when all lines have been animated
    }

    const divElement = document.createElement("div");
    poemContainer.appendChild(divElement);

    let idx = 0;
    const interval = setInterval(() => {
        divElement.innerText = lines[index].slice(0, idx);
        idx++;

        if (idx > lines[index].length) {
            clearInterval(interval);

            // Call animateText recursively for the next line after a delay
            setTimeout(() => {
                animateText(lines, index + 1);
            }, 500); // Adjust delay as needed
        }
    }, 50); // Adjust animation speed as needed
}


// script.js

document.addEventListener('DOMContentLoaded', function() {
    const openBtn = document.querySelector('.open-btn');
    const closeBtn = document.querySelector('.close-btn');
    const sidebar = document.querySelector('.sidebar');
    const content = document.querySelector('.content');

    openBtn.addEventListener('click', function() {
        sidebar.style.left = '0';
        content.style.marginLeft = '250px';
    });

    closeBtn.addEventListener('click', function() {
        sidebar.style.left = '-250px';
        content.style.marginLeft = '0';
    });
});


// Event listener for the form submission
document.getElementById("poem-form").addEventListener("submit", generatePoem);
