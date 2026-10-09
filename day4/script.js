// 1. Get the HTML elements
const noteText = document.getElementById("note-text");
const charCount = document.getElementById("char-count");
const wordCount = document.getElementById("word-count");
const clearBtn = document.getElementById("clear-btn");
const themeToggle = document.getElementById("theme-toggle");

// 2. Define localStorage keys
const DRAFT_KEY = "day4-note-draft";
const THEME_KEY = "day4-theme";

// 3. Update the character and word counters
function updateCounts() {
    const text = noteText.value;
    const characters = text.length;

    // Count words, ignoring extra spaces and empty text
    const words = text.trim() === ""
        ? 0
        : text.trim().split(/\s+/).length;

    // Display the character and word counts
    charCount.textContent = `${characters} / 200 characters`;
    wordCount.textContent = `${words} words`;

    // Remove previous warning classes
    charCount.classList.remove("warning", "over");

    // Apply the appropriate class
    if (characters > 200) {
        charCount.classList.add("over");
    } else if (characters > 180) {
        charCount.classList.add("warning");
    }
}

// 4. Save the note draft in localStorage
function saveDraft() {
    localStorage.setItem(DRAFT_KEY, noteText.value);
}

// 5. Handle typing in the textarea
noteText.addEventListener("input", function () {
    updateCounts();
    saveDraft();
});

// 6. Clear the note and remove the saved draft
function clearNote() {
    noteText.value = "";

    // Remove the saved draft
    localStorage.removeItem(DRAFT_KEY);

    // Reset the counters
    updateCounts();

    // Return the cursor to the textarea
    noteText.focus();
}

// Clear button event
clearBtn.addEventListener("click", clearNote);

// 7. Clear the note when Escape is pressed
noteText.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        clearNote();
    }
});

// 8. Update the theme button label
function updateThemeLabel() {
    if (document.body.classList.contains("dark")) {
        themeToggle.textContent = "Light mode";
    } else {
        themeToggle.textContent = "Dark mode";
    }
}

// 9. Apply the selected theme
function setTheme(isDark) {
    document.body.classList.toggle("dark", isDark);

    updateThemeLabel();
}

// Theme button event
themeToggle.addEventListener("click", function () {
    const isDark = !document.body.classList.contains("dark");

    setTheme(isDark);

    // Remember the selected theme
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
});

// 10. Restore the saved note when the page loads
const savedDraft = localStorage.getItem(DRAFT_KEY);

if (savedDraft !== null) {
    noteText.value = savedDraft;
}

// 11. Restore the saved theme when the page loads
const savedTheme = localStorage.getItem(THEME_KEY);

setTheme(savedTheme === "dark");

// 12. Update counters for the restored note
updateCounts();
