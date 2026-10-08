// Select the elements we need from the HTML
const form = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");
const searchInput = document.querySelector("#search-input");

// Get saved notes from localStorage
let notes = JSON.parse(localStorage.getItem("quickNotes")) || [];


// Function to save notes to localStorage
function saveNotes() {
    localStorage.setItem("quickNotes", JSON.stringify(notes));
}


// Function to display notes on the page
function render(filteredNotes = notes) {

    // Clear the current list
    notesList.textContent = "";

    // Update the note count
    if (filteredNotes.length === 0) {
        noteCount.textContent = "You have no notes yet.";
    } else if (filteredNotes.length === 1) {
        noteCount.textContent = "You have 1 note.";
    } else {
        noteCount.textContent = `You have ${filteredNotes.length} notes.`;
    }


    // If search has no matching notes
    if (
        filteredNotes.length === 0 &&
        searchInput.value.trim() !== ""
    ) {
        const message = document.createElement("li");
        message.textContent = "No notes match your search.";
        notesList.appendChild(message);
        return;
    }


    // Display each note
    filteredNotes.forEach(function (note) {

        const li = document.createElement("li");

        li.classList.add("note-card");

        li.classList.add(
            "category-" + note.category.toLowerCase()
        );


        // Display note text
        const noteText = document.createElement("p");
        noteText.textContent = note.text;


        // Display category
        const categoryLabel = document.createElement("small");
        categoryLabel.textContent = `Category: ${note.category}`;


        // Display date
        const date = document.createElement("small");
        date.textContent = `Created: ${note.createdAt}`;


        // Create Delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.type = "button";


        // Delete the selected note
        deleteButton.addEventListener("click", function () {

            notes = notes.filter(function (item) {
                return item.id !== note.id;
            });


            // Save the updated notes
            saveNotes();


            // Display the updated list
            render();
        });


        // Add elements to the note card
        li.appendChild(noteText);
        li.appendChild(categoryLabel);
        li.appendChild(document.createElement("br"));
        li.appendChild(date);
        li.appendChild(document.createElement("br"));
        li.appendChild(deleteButton);


        // Add the note card to the list
        notesList.appendChild(li);
    });
}


// Run when the form is submitted
form.addEventListener("submit", function (event) {

    // Stop the page from refreshing
    event.preventDefault();


    const text = noteInput.value.trim();
    const category = noteCategory.value;


    // Check for an empty note
    if (text === "") {
        errorMessage.textContent = "Please type a note first.";
        return;
    }


    // Check the 200-character limit
    if (text.length > 200) {
        errorMessage.textContent =
            "Notes must be 200 characters or fewer.";
        return;
    }


    // Clear the error message
    errorMessage.textContent = "";


    // Create a new note
    const newNote = {
        id: Date.now(),
        text: text,
        category: category,
        createdAt: new Date().toLocaleString()
    };


    // Add the note to the array
    notes.push(newNote);


    // Save notes to localStorage
    saveNotes();


    // Display the notes
    render();


    // Clear the input
    noteInput.value = "";
});


// Search notes as the user types
searchInput.addEventListener("input", function () {

    // Get the search text and make it lowercase
    const searchText = searchInput.value.trim().toLowerCase();


    // Find notes that contain the search text
    const filteredNotes = notes.filter(function (note) {
        return note.text.toLowerCase().includes(searchText);
    });


    // Display the matching notes
    render(filteredNotes);
});


// Display saved notes when the page loads
render();

