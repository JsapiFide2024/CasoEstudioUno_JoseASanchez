//Evento para obtener el formulario para editar/crear notas.
document.addEventListener('DOMContentLoaded', async () => {
    const noteForm = document.getElementById('note-form'); 
    const noteIdInput = document.getElementById('note-id');
    const noteTitleInput = document.getElementById('note-title');
    const noteContentInput = document.getElementById('note-content');
    const noteTagsInput = document.getElementById('note-tags');
    const cancelNoteButton = document.getElementById('cancel-note');
    const formTitle = document.getElementById('form-title');

    //Obtiene los parametros de la url
    const params = new URLSearchParams(window.location.search);  
    //Obtiene el valor del parametro que es el id
    const noteId = params.get('id');

    //Edicion de la nota
    if (noteId) {
        formTitle.textContent = 'Editar Nota';
        const response = await fetch(`/notas/${noteId}`);
        const note = await response.json();
        noteIdInput.value = note.id;
        noteTitleInput.value = note.titulo;
        noteContentInput.value = note.contenido;
        noteTagsInput.value = note.etiquetas.join(', '); //Array de etiquetas separadas por comas
    }

    //Evento del submit
    noteForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = noteIdInput.value;
        const titulo = noteTitleInput.value;
        const contenido = noteContentInput.value;
        const etiquetas = noteTagsInput.value.split(',').map(tag => tag.trim());

        const noteData = { titulo, contenido, etiquetas }; //Convierte los datos en un objeto

        //Si tiene id utiliza PUT para actualizar, y si no tiene id utiliza Post para crear 
        const response = id
            ? await fetch(`/notas/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(noteData)
            })
            : await fetch('/notas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(noteData)
            });

        if (response.ok) {
            const message = id ? 'Nota actualizada con éxito' : 'Nota creada con éxito';
            alert(message); // Mostrar mensaje de éxito
            window.location.href = '/'; //Redirige a la pagina principal
        } else {
            alert('Error al guardar la nota'); //Mensaje de error
        }
    });


    //Evento para el boton de cancelar
    cancelNoteButton.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '/'; //Redirige al index
    });
});