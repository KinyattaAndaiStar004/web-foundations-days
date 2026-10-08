// Select the elements we need from the HTML
const form = document.querySelector("#note-form");
const noteInput = document.querySelector("#note-input");
const noteCategory = document.querySelector("#note-category");
const notesList = document.querySelector("#notes-list");
const noteCount = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");

// Store all notes in an array
let notes = [];

// Function to display notes on the page
function render() {

    // Clear the current list
    notesList.textContent = "";

    // Update the note count
    if (notes.length === 0) {
        noteCount.textContent = "You have no notes yet.";
    } else if (notes.length === 1) {
        noteCount.textContent = "You have 1 note.";
    } else {
        noteCount.textContent = `You have ${notes.length} notes.`;
    }

    // Go through each note
    notes.forEach(function (note) {

        // Create the list item
        const li = document.createElement("li");

        // Add the note card class
        li.classList.add("note-card");

        // Add the category class
        li.classList.add(
            "category-" + note.category.toLowerCase()
        );

        // Create the note text
        const noteText = document.createElement("p");
        noteText.textContent = note.text;

        // Create the category label
        const categoryLabel = document.createElement("small");
        categoryLabel.textContent = note.category;

        // Create the date
        const date = document.createElement("small");
        date.textContent = note.createdAt;

        // Create the Delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.type = "button";

        // Delete this note when the button is clicked
        deleteButton.addEventListener("click", function () {

            notes = notes.filter(function (item) {
                return item.id !== note.id;
            });

            render();
        });

        // Add everything to the note card
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

    // Get the text entered by the user
    const text = noteInput.value.trim();

    // Get the selected category
    const category = noteCategory.value;


    // Check if the note is empty
    if (text === "") {
        errorMessage.textContent = "Please type a note first.";
        return;
    }

    // Check if the note is longer than 200 characters
    if (text.length > 200) {
        errorMessage.textContent = "Notes must be 200 characters or fewer.";
        return;
    }

    // Clear any previous error message
    errorMessage.textContent = "";


    // Create a new note object
    const newNote = {
        id: Date.now(),
        text: text,
        category: category,
        createdAt: new Date().toLocaleString()
    };

    // Add the new note to the array
    notes.push(newNote);

    // Display the notes
    render();

    // Clear the input
    noteInput.value = "";
});
