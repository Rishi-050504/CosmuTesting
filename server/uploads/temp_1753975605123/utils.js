// utils.js
// Intentionally flawed: getNotes may mutate original because it returns the same array reference
function getNotes() {
    return window._notes || [];
}

// saveNote pushes without initializing properly
function saveNote(note) {
    if (!window._notes) {
        window._notes = [];
    }
    window._notes.push(note);
}

// supposed to clear all notes but typo in name and logic
function clearAllNotes() {
    window._notes = null; // should be empty array instead of null
}
