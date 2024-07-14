document.addEventListener('DOMContentLoaded', () => {
    const notesGrid = document.getElementById('notes-grid'); //Grid de notas
    const addNoteButton = document.getElementById('add-note'); //Boton de crear nota nueva
    const searchBar = document.getElementById('search-bar'); //Barra de Busqueda

    //Const para llamar las notas desde el server
    const fetchNotes = async () => {
        const response = await fetch('/notas');
        const notes = await response.json();
        renderNotes(notes);
    };

    //Renderiza las notas
    const renderNotes = (notes) => {
        notesGrid.innerHTML = '';
        notes.forEach(note => {
            const noteElement = document.createElement('div'); //Crea un div para cada nota
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

        //Agrega eventos para los botones de editar notas
        document.querySelectorAll('.edit-note').forEach(button => {
            button.addEventListener('click', (e) => {
                const noteId = e.target.getAttribute('data-id'); //Obtiene el id de la nota
                window.location.href = `/edit?id=${noteId}`; //Referencia a la pagina de edit.html
            });
        });

        //Agrega eventos a los botones de eliminar notas 
        document.querySelectorAll('.delete-note').forEach(button => {
            button.addEventListener('click', async (e) => {
                const noteId = e.target.getAttribute('data-id'); //Obtiene el id de la nota
                await fetch(`/notas/${noteId}`, { method: 'DELETE' }); //Llama al metodo de elimar notas
                alert('Nota eliminada con éxito'); //Mensaje de alerta 
                fetchNotes(); //Vuelve a cargar las notas
            });
        });
    };

    //Evento para el boton de crear nueva nota
    addNoteButton.addEventListener('click', () => {
        window.location.href = '/edit'; //Redirige a la pagina de edit
    });

    //Evento para la barra de busqueda
    searchBar.addEventListener('input', async (e) => {
        const query = e.target.value.toLowerCase();
        const response = await fetch('/notas'); //Obtiene las notas
        const notes = await response.json(); // Convierte la respuesta en objetos
        const filteredNotes = notes.filter(note => //Filtrado de busqueda por titulo y Etiqueta
            note.titulo.toLowerCase().includes(query) ||
            note.etiquetas.some(tag => tag.toLowerCase().includes(query))
        );
        renderNotes(filteredNotes); //Renderiza las notas filtradas
    });

    fetchNotes(); //Carga las notas
});