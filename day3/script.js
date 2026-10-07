// ========================================
// DAY 3 - NOTES TOOLKIT
// ========================================


// Starting notes data
let notes = [
    {
        id: 1,
        text: "Buy milk and bread",
        category: "personal"
    },
    {
        id: 2,
        text: "Finish the Day 3 assignment",
        category: "study"
    },
    {
        id: 3,
        text: "Email the project report to Grace",
        category: "work"
    },
    {
        id: 4,
        text: "Revise JavaScript arrays",
        category: "study"
    },
    {
        id: 5,
        text: "Call mum",
        category: "personal"
    }
];


// ========================================
// 1. SEARCH NOTES
// ========================================

function searchNotes(word) {
    return notes.filter((note) =>
        note.text.toLowerCase().includes(word.toLowerCase())
    );
}


// Tests
console.log("searchNotes - normal:");
console.log(searchNotes("JavaScript"));
// Expected: [{ id: 4, text: "Revise JavaScript arrays", category: "study" }]

console.log("searchNotes - no results:");
console.log(searchNotes("pizza"));
// Expected: []


// ========================================
// 2. LONGEST NOTE
// ========================================

function longestNote() {

    // If there are no notes, return null
    if (notes.length === 0) {
        return null;
    }

    // Start by assuming the first note is the longest
    let longest = notes[0];

    // Compare every note with the current longest note
    for (let note of notes) {
        if (note.text.length > longest.text.length) {
            longest = note;
        }
    }

    return longest;
}


// Tests
console.log("longestNote - normal:");
console.log(longestNote());
// Expected: { id: 3, text: "Email the project report to Grace", category: "work" }

console.log("longestNote - empty array:");
let savedNotes = notes;
notes = [];
console.log(longestNote());
// Expected: null
notes = savedNotes;


// ========================================
// 3. COUNT BY CATEGORY
// ========================================

function countByCategory() {

    // Object that will store our counts
    const counts = {};

    // Loop through every note
    for (let note of notes) {

        // If the category does not exist yet, start at 0
        if (!counts[note.category]) {
            counts[note.category] = 0;
        }

        // Increase the category count
        counts[note.category]++;
    }

    return counts;
}


// Tests
console.log("countByCategory - normal:");
console.log(countByCategory());
// Expected: { personal: 2, study: 2, work: 1 }

console.log("countByCategory - empty array:");
savedNotes = notes;
notes = [];
console.log(countByCategory());
// Expected: {}
notes = savedNotes;


// ========================================
// 4. GET SUMMARY
// ========================================

function getSummary() {

    const counts = countByCategory();

    const word = notes.length === 1 ? "note" : "notes";

    return `${notes.length} ${word}: ${counts.personal || 0} personal, ${counts.work || 0} work, ${counts.study || 0} study.`;
}


// Tests
console.log("getSummary - normal:");
console.log(getSummary());
// Expected: "5 notes: 2 personal, 1 work, 2 study."

console.log("getSummary - one note:");
savedNotes = notes;
notes = [
    {
        id: 1,
        text: "Test note",
        category: "personal"
    }
];
console.log(getSummary());
// Expected: "1 note: 1 personal, 0 work, 0 study."
notes = savedNotes;


// ========================================
// 5. IS DUPLICATE
// ========================================

function isDuplicate(text) {

    const newText = text.trim().toLowerCase();

    return notes.some((note) =>
        note.text.trim().toLowerCase() === newText
    );
}


// Tests
console.log("isDuplicate - existing note:");
console.log(isDuplicate("Call mum"));
// Expected: true

console.log("isDuplicate - new note:");
console.log(isDuplicate("Go to the gym"));
// Expected: false

console.log("isDuplicate - extra spaces and different case:");
console.log(isDuplicate("   CALL MUM   "));
// Expected: true


// ========================================
// 6. ADD NOTE
// ========================================

function addNote(text, category) {

    // Remove unnecessary spaces
    text = text.trim();

    // Check if the text length is valid
    if (text.length < 1 || text.length > 200) {
        console.log("Cannot add note: text must be between 1 and 200 characters.");
        return false;
    }

    // Check if the note already exists
    if (isDuplicate(text)) {
        console.log("Cannot add note: this note already exists.");
        return false;
    }

    // Check if the category is valid
    const validCategories = ["personal", "work", "study"];

    if (!validCategories.includes(category)) {
        console.log("Cannot add note: category must be personal, work, or study.");
        return false;
    }

    // Create the new note
    const newNote = {
        id: notes.length + 1,
        text: text,
        category: category
    };

    // Add the new note to the notes array
    notes.push(newNote);

    console.log("Note added successfully.");

    return true;
}


// Tests
console.log("addNote - valid note:");
console.log(addNote("Buy a new laptop", "personal"));
// Expected: true

console.log("addNote - duplicate note:");
console.log(addNote("Call mum", "personal"));
// Expected: false

console.log("addNote - invalid category:");
console.log(addNote("Learn Python", "school"));
// Expected: false

console.log("addNote - empty text:");
console.log(addNote("", "study"));
// Expected: false


// ========================================
// FINAL NOTES
// ========================================

console.log("Final notes:");
console.log(notes);