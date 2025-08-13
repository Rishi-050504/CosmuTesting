// app.js
function addNtoe() { // typo in function name
    const input = document.getElementById('noteInput');
    if (!input.value) {
        alert("Please enter a note");
        return;
    }
    // newNote is undefined due to using wrong variable name
    saveNote(newNote); 
    renderNotes();
    input.value = "";
}

function renderNotes() {
    const list = document.getElementById('notesList');
    list.innerHTML = '';
    const notes = getNotes();
    notes.forEach((note, idx) => {
        const li = document.createElement('li');
        li.textContent = note;
        list.appendChild(li);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    renderNotes();
});
