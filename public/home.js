document.addEventListener('DOMContentLoaded', () => {
    const notesGrid = document.getElementById('notes-grid');
    const addNoteButton = document.getElementById('add-note');
    const searchBar = document.getElementById('search-bar');

    const fetchNotes = async () => {
        const response = await fetch('/notas');
        const notes = await response.json();
        renderNotes(notes);
    };

    const renderNotes = (notes) => {
        notesGrid.innerHTML = '';
        notes.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.classList.add('col-md-4');
            noteElement.innerHTML = `
                <div style="background-color: white; color: black; "class="card mb-3">
                    <div  class="card-body">
                        <h5 class="card-title"><strong>${note.titulo}<strong></h5>
                        <p class="card-text">${note.contenido}</p>
                        <p color: white; "class="card-text"><i><small class="text-muted">Etiquetas: ${note.etiquetas.join(', ')}</small><i></p>
                        <p class="card-text"><i><small class="text-muted">Creado: ${new Date(note.fechaCreacion).toLocaleString()}</small><i></p>
                        <p class="card-text"><i><small class="text-muted">Modificado: ${new Date(note.fechaModificacion).toLocaleString()}</small><i></p>
                        <button class="btn btn-transparent edit-note btn-transparent" style="background-color: rgba(116, 198, 157, 0.5); color: white;" data-id="${note.id}">Editar</button>
                        <button class="btn btn-transparent delete-note btn-transparent" style="background-color: rgba(255, 0, 0, 0.5); color: white;" data-id="${note.id}">Eliminar</button>
                    </div>
                </div>
            `;
            notesGrid.appendChild(noteElement);
        });

        document.querySelectorAll('.edit-note').forEach(button => {
            button.addEventListener('click', (e) => {
                const noteId = e.target.getAttribute('data-id');
                window.location.href = `/edit?id=${noteId}`;
            });
        });

        document.querySelectorAll('.delete-note').forEach(button => {
            button.addEventListener('click', async (e) => {
                const noteId = e.target.getAttribute('data-id');
                await fetch(`/notas/${noteId}`, { method: 'DELETE' });
                alert('Nota eliminada con éxito');
                fetchNotes();
            });
        });
    };

    addNoteButton.addEventListener('click', () => {
        window.location.href = '/edit';
    });

    searchBar.addEventListener('input', async (e) => {
        const query = e.target.value.toLowerCase();
        const response = await fetch('/notas');
        const notes = await response.json();
        const filteredNotes = notes.filter(note => 
            note.titulo.toLowerCase().includes(query) ||
            note.etiquetas.some(tag => tag.toLowerCase().includes(query))
        );
        renderNotes(filteredNotes);
    });

    fetchNotes();
});