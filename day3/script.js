
let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

// 1. searchNotes(word)
function searchNotes(word) {
  const searchWord = word.toLowerCase();

  return notes.filter(function (note) {
    return note.text.toLowerCase().includes(searchWord);
  });
}

console.log(searchNotes("javascript"));
// Expected: [{ id: 4, text: "Revise JavaScript arrays", category: "study" }]

console.log(searchNotes("python"));
// Expected: []


// 2. longestNote()
function longestNote() {
  if (notes.length === 0) {
    return null;
  }

  let longest = notes[0];

  for (let i = 1; i < notes.length; i++) {
    if (notes[i].text.length > longest.text.length) {
      longest = notes[i];
    }
  }

  return longest;
}

console.log(longestNote());
// Expected: { id: 3, text: "Email the project report to Grace", category: "work" }

const originalNotes = notes;
notes = [];

console.log(longestNote());
// Expected: null

notes = originalNotes;


// 3. countByCategory()
function countByCategory() {
  const counts = {};

  for (const note of notes) {
    if (counts[note.category]) {
      counts[note.category]++;
    } else {
      counts[note.category] = 1;
    }
  }

  return counts;
}

console.log(countByCategory());
// Expected: { personal: 2, study: 2, work: 1 }

const savedNotes = notes;
notes = [];

console.log(countByCategory());
// Expected: {}

notes = savedNotes;


// 4. getSummary()
function getSummary() {
  const counts = countByCategory();
  const noteWord = notes.length === 1 ? "note" : "notes";

  return `${notes.length} ${noteWord}: ${counts.personal || 0} personal, ${counts.work || 0} work, ${counts.study || 0} study.`;
}

console.log(getSummary());
// Expected: 5 notes: 2 personal, 1 work, 2 study.

const summaryNotes = notes;
notes = [];

console.log(getSummary());
// Expected: 0 notes: 0 personal, 0 work, 0 study.

notes = summaryNotes;


// 5. isDuplicate(text)
function isDuplicate(text) {
  const cleanedText = text.trim().toLowerCase();

  return notes.some(function (note) {
    return note.text.trim().toLowerCase() === cleanedText;
  });
}

console.log(isDuplicate("Call mum"));
// Expected: true

console.log(isDuplicate("  CALL MUM  "));
// Expected: true


// 6. addNote(text, category)
function addNote(text, category) {
  const cleanedText = text.trim();

  if (cleanedText.length < 1 || cleanedText.length > 200) {
    console.log("Cannot add note: text must be between 1 and 200 characters.");
    return false;
  }

  if (isDuplicate(cleanedText)) {
    console.log("Cannot add note: duplicate text.");
    return false;
  }

  const validCategories = ["personal", "work", "study"];

  if (!validCategories.includes(category)) {
    console.log(
      "Cannot add note: category must be personal, work, or study."
    );
    return false;
  }

  const newNote = {
    id: notes.length > 0
      ? Math.max(...notes.map(function (note) {
          return note.id;
        })) + 1
      : 1,
    text: cleanedText,
    category: category,
  };

  notes.push(newNote);

  console.log("Note added successfully.");
  return true;
}

console.log(addNote("Prepare for the JavaScript test", "study"));
// Expected: true

console.log(addNote("Call mum", "personal"));
// Expected: false

